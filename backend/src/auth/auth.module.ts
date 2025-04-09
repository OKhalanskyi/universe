import CONSTANTS from "../config/constants";
import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./services/auth.service";
import {TokenService} from "./services/token.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {GithubStrategy} from "./strategies/github.strategy";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {SessionSerializer} from "./session.serializer";

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      session: true,
      // property: 'user',
      defaultStrategy: 'jwt'
    }),
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: CONSTANTS.JWT_SECRET,
        signOptions: {
          expiresIn: CONSTANTS.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, LocalStrategy, JwtStrategy, GithubStrategy, SessionSerializer],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
