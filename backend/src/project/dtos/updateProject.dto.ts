import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './createProject.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
