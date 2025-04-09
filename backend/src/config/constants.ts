import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  validateSync,
  IsArray,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import * as path from "node:path";

export class EnvConfig {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  API_PORT: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  ALLOWED_ORIGINS: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  ALLOWED_HEADERS: string[];

  @IsNotEmpty()
  @IsString()
  ALLOWED_METHODS: string;

  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CALLBACK_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  COOKIES_SECRET: string;

  @IsString()
  @IsNotEmpty()
  COOKIES_PATH: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string;
}


const configInstance = plainToInstance(EnvConfig, process.env);
const errors = validateSync(configInstance, { skipMissingProperties: false });

if (errors.length > 0) {
  throw new InternalServerErrorException(errors);
  process.exit(1);
}

const CONSTANTS = {
  ...configInstance,
};

export default CONSTANTS;
