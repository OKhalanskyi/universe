import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRepositoryDto {
  @ApiProperty({
    description: 'Project ID to associate with this repository',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  projectId?: string;
}
