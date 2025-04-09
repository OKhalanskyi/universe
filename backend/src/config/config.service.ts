import { Injectable } from '@nestjs/common';
import CONSTANTS, { EnvConfig } from './constants';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    this.envConfig = CONSTANTS;
  }

  get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.envConfig[key];
  }

  get isDevelopment(): boolean {
    return this.envConfig.NODE_ENV === 'development';
  }
}
