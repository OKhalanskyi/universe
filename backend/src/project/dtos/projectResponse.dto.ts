import { ApiProperty } from '@nestjs/swagger';
import { RepositoryResponseDto } from '../../github-repository/dtos/repositoryResponse.dto';

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Unique project identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Frontend Libraries',
  })
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Collection of JavaScript frontend1 libraries',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'User ID who owns the project',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Date when the project was created',
    example: '2023-04-09T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the project was last updated',
    example: '2023-04-09T14:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of repositories associated with this project',
    type: [RepositoryResponseDto],
    required: false,
  })
  repositories?: any[];
}
