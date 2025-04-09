import {MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {PrismaService} from "./prisma/prisma.service";
import {TransactionalAdapterPrisma} from "@nestjs-cls/transactional-adapter-prisma";
import {PrismaModule} from "./prisma/prisma.module";
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';
import {ConfigService} from "./config/config.service";
import {SecurityMiddleware} from "./middlewares/securityMiddleware";
import {AuthModule} from "./auth/auth.module";
import {ProjectModule} from "./project/project.module";
import {GithubRepositoryModule} from "./github-repository/githubRepository.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectModule,
    GithubRepositoryModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
