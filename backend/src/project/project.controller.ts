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
import { ProjectService } from './project.service';
import {CreateProjectDto} from "./dtos/createProject.dto";
import {ProjectResponseDto} from "./dtos/projectResponse.dto";
import {GetUser} from "../auth/getUser";
import {UpdateProjectDto} from "./dtos/updateProject.dto";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new project',
    description: 'Create a new project to organize GitHub repositories'
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project successfully created',
    type: ProjectResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @GetUser('id') userId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.create(userId, createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get projects list',
    description: 'Retrieve list of all projects for the authenticated user'
  })
  @ApiQuery({
    name: 'includeRepositories',
    required: false,
    type: Boolean,
    description: 'Include associated repositories in the response'
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects',
    type: [ProjectResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @GetUser('id') userId: string,
    @Query('includeRepositories') includeRepositories?: boolean,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.findAll(userId, includeRepositories);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project details',
    description: 'Retrieve detailed information about a specific project'
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiQuery({
    name: 'includeRepositories',
    required: false,
    type: Boolean,
    description: 'Include associated repositories in the response'
  })
  @ApiResponse({
    status: 200,
    description: 'Project details',
    type: ProjectResponseDto
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Query('includeRepositories') includeRepositories?: boolean,
  ): Promise<ProjectResponseDto> {
    return this.projectService.findOne(id, userId, includeRepositories);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update project information such as name or description'
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Project successfully updated',
    type: ProjectResponseDto
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.update(id, userId, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete project',
    description: 'Remove a project and disassociate all repositories from it'
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 204, description: 'Project successfully deleted' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    return this.projectService.remove(id, userId);
  }
}