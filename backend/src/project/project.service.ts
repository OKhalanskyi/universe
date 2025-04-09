import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectResponseDto } from './dtos/projectResponse.dto';
import { CreateProjectDto } from './dtos/createProject.dto';
import { UpdateProjectDto } from './dtos/updateProject.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        user: {
          connect: { id: userId },
        },
      },
    });

    return this.mapToResponseDto(project);
  }

  async findAll(
    userId: string,
    includeRepositories = false,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      include: includeRepositories
        ? {
            repositories: true,
          }
        : undefined,
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map((project) => this.mapToResponseDto(project));
  }

  async findOne(
    id: string,
    userId: string,
    includeRepositories = false,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      include: includeRepositories
        ? {
            repositories: true,
          }
        : undefined,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.mapToResponseDto(project);
  }

  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        name: updateProjectDto.name,
        description: updateProjectDto.description,
        updatedAt: new Date(),
      },
    });

    return this.mapToResponseDto(updatedProject);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({
      where: { id },
    });
  }

  private mapToResponseDto(project: any): ProjectResponseDto {
    const response: ProjectResponseDto = {
      id: project.id,
      name: project.name,
      description: project.description,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    if (project.repositories) {
      response.repositories = project.repositories.map((repo) => ({
        id: repo.id,
        owner: repo.owner,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        stars: repo.stars,
        forks: repo.forks,
        openIssues: repo.openIssues,
        createdAt: repo.createdAt,
        isUserOwned: repo.isUserOwned,
        projectId: repo.projectId,
      }));
    }

    return response;
  }
}
