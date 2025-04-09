import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import CONSTANTS from "../../config/constants";
import {PrismaService} from "../../prisma/prisma.service";
import {FastifyReply} from "fastify";
import {setCookie} from "../../utils/setCookie";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);

      const session = await this.prismaService.session.findUnique({
        where: { token },
      });

      if (!session) {
        return null;
      }

      if (new Date() > session.expiresAt) {
        await this.prismaService.session.delete({
          where: { token },
        });
        return null;
      }


      return payload;
    } catch (error) {
      return null;
    }
  }

  setTokenCookie(res: FastifyReply, token: string): void {
    setCookie(res, 'access_token', token, {
      httpOnly: true,
      secure: CONSTANTS.NODE_ENV === 'production',
      sameSite: CONSTANTS.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  extractToken(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }

  clearTokenCookie(res: FastifyReply): void {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: CONSTANTS.NODE_ENV === 'production',
      path: '/',
    });
  }

  async createSession(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prismaService.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async invalidateSession(token: string): Promise<void> {
    await this.prismaService.session.delete({
      where: { token },
    });
  }
}
