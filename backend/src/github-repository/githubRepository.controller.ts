import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {GithubRepositoryService} from "./services/github-repository.service";
import {CreateRepositoryDto} from "./dtos/createRepository.dto";
import {RepositoryResponseDto} from "./dtos/repositoryResponse.dto";
import {GetUser} from "../auth/getUser";
import {UpdateRepositoryDto} from "./dtos/updateRepository.dto";
import {User} from "@prisma/client";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('GitHub Repositories')
@Controller('repositories')
@UseGuards(JwtAuthGuard)
export class GithubRepositoryController {
  constructor(private readonly repositoryService: GithubRepositoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a new GitHub repository',
    description: 'Add a GitHub repository to your account by specifying the path in owner/name format'
  })
  @ApiBody({ type: CreateRepositoryDto })
  @ApiResponse({
    status: 201,
    description: 'Repository successfully added',
    type: RepositoryResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Repository not found on GitHub' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @GetUser() user: User,
    @Body() createRepositoryDto: CreateRepositoryDto,
  ): Promise<RepositoryResponseDto> {
    return this.repositoryService.create(user, createRepositoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get repositories list',
    description: 'Retrieve list of repositories with optional filtering by project'
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter repositories by project ID'
  })
  @ApiQuery({
    name: 'unassigned',
    required: false,
    description: 'If true, return only repositories not associated with any project'
  })
  @ApiResponse({
    status: 200,
    description: 'List of repositories',
    type: [RepositoryResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @GetUser('id') userId: string,
    @Query('projectId') projectId?: string,
    @Query('unassigned') unassigned?: string,
  ): Promise<RepositoryResponseDto[]> {
    const showUnassigned = unassigned === 'true';
    return this.repositoryService.findAll(userId, projectId, showUnassigned);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get repository details',
    description: 'Retrieve detailed information about a specific repository'
  })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiResponse({
    status: 200,
    description: 'Repository details',
    type: RepositoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<RepositoryResponseDto> {
    return this.repositoryService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update repository',
    description: 'Update repository information, such as the associated project'
  })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiBody({ type: UpdateRepositoryDto })
  @ApiResponse({
    status: 200,
    description: 'Repository successfully updated',
    type: RepositoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ): Promise<RepositoryResponseDto> {
    return this.repositoryService.update(id, userId, updateRepositoryDto);
  }

  @Post(':id/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh repository data',
    description: 'Update repository information with the latest data from GitHub API'
  })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiResponse({
    status: 200,
    description: 'Repository data successfully refreshed',
    type: RepositoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  refresh(@GetUser() user, @Param('id') id: string): Promise<RepositoryResponseDto> {
    return this.repositoryService.refresh(user, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete repository',
    description: 'Remove a repository from your account'
  })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiResponse({ status: 204, description: 'Repository successfully deleted' })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    return this.repositoryService.remove(id, userId);
  }

  @Post('sync')
  @ApiOperation({
    summary: 'Sync user repositories',
    description: 'Synchronize repositories from your GitHub account'
  })
  @ApiResponse({
    status: 200,
    description: 'Repositories successfully synchronized',
    type: [RepositoryResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  syncUserRepositories(
    @GetUser() user: User,
  ): Promise<RepositoryResponseDto[]> {
    return this.repositoryService.syncUserRepositories(user);
  }
}