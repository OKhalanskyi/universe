import {ApiProperty} from "@nestjs/swagger";

export class RepositoryResponseDto {
  @ApiProperty({
    description: 'Unique repository identifier in the system',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  id: string;

  @ApiProperty({
    description: 'Repository owner (username or organization)',
    example: 'facebook'
  })
  owner: string;

  @ApiProperty({
    description: 'Repository name',
    example: 'react'
  })
  name: string;

  @ApiProperty({
    description: 'Full repository name in owner/name format',
    example: 'facebook/react'
  })
  fullName: string;

  @ApiProperty({
    description: 'Repository URL on GitHub',
    example: 'https://github.com/facebook/react'
  })
  url: string;

  @ApiProperty({
    description: 'Number of stars on the repository',
    example: 180000
  })
  stars: number;

  @ApiProperty({
    description: 'Number of forks of the repository',
    example: 37000
  })
  forks: number;

  @ApiProperty({
    description: 'Number of open issues in the repository',
    example: 800
  })
  openIssues: number;

  @ApiProperty({
    description: 'Date when the repository was created on GitHub',
    example: '2013-05-24T16:15:54Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Indicates if the repository is owned by the current user',
    example: false
  })
  isUserOwned: boolean;

  @ApiProperty({
    description: 'Project ID that this repository is associated with (if any)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true
  })
  projectId?: string;
}
