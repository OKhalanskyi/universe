import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 chars, must include uppercase, lowercase, and number)',
    example: 'Password123',
    minLength: 8
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message: 'Password must contain at least one number, one uppercase and one lowercase letter',
  })
  password: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;
}
