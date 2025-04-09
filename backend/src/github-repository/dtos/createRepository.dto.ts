import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateRepositoryDto {
  @ApiProperty({
    description: 'GitHub repository path in owner/name format',
    example: 'facebook/react',
    pattern: '^[a-zA-Z0-9\\-]+\\/[a-zA-Z0-9\\-_.]+$'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-_.]+$/, {
    message: 'Repository path must be in format owner/name',
  })
  path: string;

  @ApiProperty({
    description: 'Project ID to associate with this repository',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsString()
  projectId?: string;
}
