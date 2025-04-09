import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import CONSTANTS from './config/constants';
import { HttpExceptionFilter } from './filters/httpExceptionFilter';
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from "passport";

async function bootstrap() {
  const PORT = CONSTANTS.API_PORT || 3001;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('GitHub Projects CRM API')
  .setDescription('API для управління проєктами GitHub')
  .setVersion('1.0')
  .addTag('auth', 'Автентифікація та авторизація')
  .addTag('repositories', 'Управління репозиторіями GitHub')
  .addTag('projects', 'Управління проєктами')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Введіть ваш JWT токен',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const fastifyInstance = app.getHttpAdapter().getInstance()

  fastifyInstance.addHook('onRequest', (request: any, reply: any, done: any) => {
    if (!reply.setHeader) {
      reply.setHeader = function(name: string, value: string) {
        try {
          return this.header(name, value);
        } catch (error) {
          console.error(`Error in setHeader compatibility: ${error.message}`);
        }
      };
    }

    if (!reply.end) {
      reply.end = function(data: any) {
        try {
          return this.send(data);
        } catch (error) {
          console.error(`Error in end compatibility: ${error.message}`);
        }
      };
    }

    if (!request.getHeader) {
      request.getHeader = function(name: string) {
        return this.headers[name.toLowerCase()];
      };
    }

    done();
  });

  await app.register(fastifyCookie, {
    secret: CONSTANTS.COOKIES_SECRET,
  });

  await app.register(fastifySession, {
    cookieName: 'sessionId',
    secret: CONSTANTS.COOKIES_SECRET || 'another-secret-key',
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  });

  app.use(passport.initialize());
  // app.use(passport.session());

  app.enableCors({
    credentials: true,
    methods: CONSTANTS.ALLOWED_METHODS,
    origin: CONSTANTS.ALLOWED_ORIGINS,
    allowedHeaders: CONSTANTS.ALLOWED_HEADERS,
  });

  app.use(cookieParser());
  app.useGlobalPipes();
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
