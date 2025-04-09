import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GithubApiService } from './github-api.service';
import { CreateRepositoryDto } from '../dtos/createRepository.dto';
import { RepositoryResponseDto } from '../dtos/repositoryResponse.dto';
import { UpdateRepositoryDto } from '../dtos/updateRepository.dto';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';

@Injectable()
export class GithubRepositoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubApiService: GithubApiService,
    private readonly userService: UserService,
  ) {}

  async create(
    user: User,
    createRepoDto: CreateRepositoryDto,
  ): Promise<RepositoryResponseDto> {
    const [owner, name] = createRepoDto.path.split('/');
    const fullName = `${owner}/${name}`;

    const existingRepo = await this.prisma.githubRepository.findUnique({
      where: {
        userId_fullName: {
          userId: user.id,
          fullName,
        },
      },
    });

    if (existingRepo) {
      if (
        createRepoDto.projectId ||
        existingRepo.projectId !== createRepoDto.projectId
      ) {
        return this.update(existingRepo.id, user.id, {
          projectId: createRepoDto.projectId,
        });
      }
      return this.refresh(user, existingRepo.id);
    }

    if (createRepoDto.projectId) {
      const repoInProject = await this.prisma.githubRepository.findFirst({
        where: {
          projectId: createRepoDto.projectId,
          fullName: fullName,
        },
      });

      if (repoInProject) {
        throw new ConflictException(
          `Repository ${fullName} already exists in this project`,
        );
      }
    }

    const repoData = await this.githubApiService.getRepositoryData(
      owner,
      name,
      user.githubAccessToken,
    );

    const repository = await this.prisma.githubRepository.create({
      data: {
        owner,
        name,
        fullName,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        createdAt: new Date(repoData.created_at),
        updatedAt: new Date(),
        lastFetchedAt: new Date(),
        isUserOwned: false,
        user: {
          connect: { id: user.id },
        },
        ...(createRepoDto.projectId && {
          project: {
            connect: { id: createRepoDto.projectId },
          },
        }),
      },
    });

    return this.mapToResponseDto(repository);
  }

  async findAll(
    userId: string,
    projectId?: string,
    showUnassigned?: boolean,
  ): Promise<RepositoryResponseDto[]> {
    const whereClause: any = { userId };

    if (projectId) {
      whereClause.projectId = projectId;
    } else if (showUnassigned) {
      whereClause.projectId = null;
    }

    const repositories = await this.prisma.githubRepository.findMany({
      where: whereClause,
      orderBy: { stars: 'desc' },
    });

    return repositories.map(this.mapToResponseDto);
  }

  async findOne(id: string, userId: string): Promise<RepositoryResponseDto> {
    const repository = await this.prisma.githubRepository.findFirst({
      where: { id, userId },
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    return this.mapToResponseDto(repository);
  }

  async update(
    id: string,
    userId: string,
    updateRepoDto: UpdateRepositoryDto,
  ): Promise<RepositoryResponseDto> {
    const repository = await this.prisma.githubRepository.findFirst({
      where: { id, userId },
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    if (
      updateRepoDto.projectId !== undefined &&
      updateRepoDto.projectId !== repository.projectId
    ) {
      if (updateRepoDto.projectId) {
        const repoInProject = await this.prisma.githubRepository.findFirst({
          where: {
            projectId: updateRepoDto.projectId,
            fullName: repository.fullName,
            NOT: {
              id: id,
            },
          },
        });

        if (repoInProject) {
          throw new ConflictException(
            `Repository ${repository.fullName} already exists in this project`,
          );
        }
      }
    }

    const updatedRepository = await this.prisma.githubRepository.update({
      where: { id },
      data: {
        projectId: updateRepoDto.projectId,
        updatedAt: new Date(),
      },
    });

    return this.mapToResponseDto(updatedRepository);
  }

  async refresh(user: User, id: string): Promise<RepositoryResponseDto> {
    const { githubId } = await this.userService.findOne(user.id);

    let githubAccessToken = user.githubAccessToken;

    if (githubId) {
      const userWithGithub = await this.userService.findByGithubId(githubId);
      if (!userWithGithub) {
        throw new NotFoundException(
          `User with GitHub ID ${githubId} not found`,
        );
      }
      githubAccessToken = userWithGithub.githubAccessToken;
    }

    const repository = await this.prisma.githubRepository.findUnique({
      where: { id },
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    const repoData = await this.githubApiService.getRepositoryData(
      repository.owner,
      repository.name,
      githubAccessToken,
    );

    const updatedRepository = await this.prisma.githubRepository.update({
      where: { id },
      data: {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        updatedAt: new Date(),
        lastFetchedAt: new Date(),
      },
    });

    return this.mapToResponseDto(updatedRepository);
  }

  async remove(id: string, userId: string): Promise<void> {
    const repository = await this.prisma.githubRepository.findFirst({
      where: { id, userId },
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    await this.prisma.githubRepository.delete({
      where: { id },
    });
  }

  async syncUserRepositories(user: User): Promise<RepositoryResponseDto[]> {
    const { githubId } = await this.userService.findOne(user.id);
    let githubAccessToken = user.githubAccessToken;

    if (githubId) {
      const userWithGithub = await this.userService.findByGithubId(githubId);
      if (!userWithGithub) {
        throw new NotFoundException(
          `User with GitHub ID ${githubId} not found`,
        );
      }
      githubAccessToken = userWithGithub.githubAccessToken;
    }

    const repos =
      await this.githubApiService.getUserRepositories(githubAccessToken);

    const syncedRepos = await Promise.all(
      repos.map(async (repo) => {
        const existingRepo = await this.prisma.githubRepository.findUnique({
          where: {
            userId_fullName: {
              userId: user.id,
              fullName: repo.full_name,
            },
          },
        });

        if (existingRepo) {
          return this.prisma.githubRepository.update({
            where: { id: existingRepo.id },
            data: {
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              openIssues: repo.open_issues_count,
              updatedAt: new Date(),
              lastFetchedAt: new Date(),
              isUserOwned: true,
            },
          });
        } else {
          const [owner, name] = repo.full_name.split('/');

          return this.prisma.githubRepository.create({
            data: {
              owner,
              name,
              fullName: repo.full_name,
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              openIssues: repo.open_issues_count,
              createdAt: new Date(repo.created_at),
              updatedAt: new Date(),
              lastFetchedAt: new Date(),
              isUserOwned: true,
              user: {
                connect: { id: user.id },
              },
            },
          });
        }
      }),
    );

    return syncedRepos.map(this.mapToResponseDto);
  }

  private mapToResponseDto(repository: any): RepositoryResponseDto {
    return {
      id: repository.id,
      owner: repository.owner,
      name: repository.name,
      fullName: repository.fullName,
      url: repository.url,
      stars: repository.stars,
      forks: repository.forks,
      openIssues: repository.openIssues,
      createdAt: repository.createdAt,
      isUserOwned: repository.isUserOwned,
      projectId: repository.projectId,
    };
  }
}
