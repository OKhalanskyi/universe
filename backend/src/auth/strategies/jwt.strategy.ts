import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import CONSTANTS from '../../config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return tokenService.extractToken(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: CONSTANTS.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const token = this.tokenService.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (new Date() > session.expiresAt) {
      await this.prisma.session.delete({
        where: { token },
      });
      throw new UnauthorizedException('Session expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        githubId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
