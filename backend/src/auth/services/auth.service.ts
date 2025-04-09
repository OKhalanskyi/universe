import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {TokenService} from "./token.service";
import * as bcrypt from 'bcryptjs';
import {RegisterDto} from "../dtos/register.dto";
import {UserService} from "../../user/user.service";
import {LoginDto} from "../dtos/login.dto";
import {FastifyReply} from "fastify";


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async register(registerDto: RegisterDto, res?: FastifyReply) {
    const { email, password, name } = registerDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = this.tokenService.generateToken(user.id);

    await this.tokenService.createSession(user.id, token);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  async login(loginDto: LoginDto, res?: FastifyReply) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenService.generateToken(user.id);

    await this.tokenService.createSession(user.id, token);

    if (res) {
      this.tokenService.setTokenCookie(res, token);
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });


    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateGithubUser(profile: any) {
    const { id, emails, displayName, photos } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : null;
    const avatarUrl = photos && photos.length > 0 ? photos[0].value : null;

    if (!email) {
      throw new UnauthorizedException('Email not provided from GitHub');
    }

    let user = await this.prisma.user.findUnique({
      where: { githubId: id.toString() },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            githubId: id.toString(),
            name: user.name || displayName,
            avatarUrl: user.avatarUrl || avatarUrl,
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            email,
            githubId: id.toString(),
            name: displayName,
            avatarUrl,
          },
        });
      }
    }

    return user;
  }

  async handleGithubLogin(user: any, accessToken: string, res?: FastifyReply) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        githubAccessToken: accessToken,
      },
    });

    const token = this.tokenService.generateToken(user.id);

    await this.tokenService.createSession(user.id, token);

    if (res) {
      this.tokenService.setTokenCookie(res, token);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  async logout(token: string, res?: FastifyReply) {
    await this.tokenService.invalidateSession(token);

    if (res) {
      this.tokenService.clearTokenCookie(res);
    }

    return { success: true };
  }
}