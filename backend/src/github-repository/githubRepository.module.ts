import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GithubRepositoryController } from './githubRepository.controller';
import { HttpModule } from '@nestjs/axios';
import { GithubRepositoryService } from './services/github-repository.service';
import { GithubApiService } from './services/github-api.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [GithubRepositoryController],
  providers: [GithubRepositoryService, GithubApiService],
  exports: [GithubRepositoryService, GithubApiService],
})
export class GithubRepositoryModule {}
