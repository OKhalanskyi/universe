import {ConflictException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from "./dtos/createUser.dto";
import {UserDto} from "./dtos/user.dto";
import {UpdateUserDto} from "./dtos/updateUser.dto";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, password, name, avatarUrl } = createUserDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      this.logger.warn(`Attempt to create user with existing email: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      const hashedPassword = password ? await this.hashPassword(password) : null;

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl,
        },
      });

      return this.mapToUserDto(user);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(skip = 0, take = 10): Promise<UserDto[]> {
    try {
      const users = await this.prisma.user.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return users.map(user => this.mapToUserDto(user));
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.mapToUserDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return this.mapToUserDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch user by email ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByGithubId(githubId: string): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { githubId },
      });

      if (!user) {
        throw new NotFoundException(`User with GitHub ID ${githubId} not found`);
      }

      return this.mapToUserWithTokenDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch user by GitHub ID ${githubId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    await this.findOne(id);

    if (updateUserDto.email) {
      const userWithEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException(`User with email ${updateUserDto.email} already exists`);
      }
    }

    let data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await this.hashPassword(updateUserDto.password);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return this.mapToUserDto(updatedUser);
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.findOne(id);

    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to remove user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserGithubRepositories(userId: string) {
    await this.findOne(userId);

    try {
      return await this.prisma.githubRepository.findMany({
        where: {userId},
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch GitHub repositories for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private mapToUserDto(user: any): UserDto {
    const { password, githubAccessToken, ...userDto } = user;
    return userDto;
  }

  private mapToUserWithTokenDto(user: any): UserDto {
    const { password, ...userWithTokenDto } = user;
    return userWithTokenDto;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
