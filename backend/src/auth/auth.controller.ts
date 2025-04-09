import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { GithubAuthGuard } from './guards/githubAuth.guard';
import { FastifyReply } from 'fastify';
import { GetUser } from './getUser';
import CONSTANTS from '../config/constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.register(registerDto, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User logout',
    description: 'Invalidate user session and clear cookies',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.login(loginDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Вихід користувача' })
  @ApiResponse({ status: 200, description: 'Успішний вихід' })
  @ApiResponse({ status: 401, description: 'Неавторизований запит' })
  @Post('logout')
  logout(@Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    const token = this.tokenService.extractToken(req);
    return this.authService.logout(token, res);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary: 'GitHub OAuth login',
    description: 'Redirect to GitHub for OAuth authentication',
  })
  @ApiResponse({ status: 302, description: 'Redirect to GitHub OAuth page' })
  githubAuth() {
    console.log('Redirecting to GitHub for authentication...');
  }

  @Get('github/callback')
  @ApiOperation({
    summary: 'GitHub OAuth callback',
    description: 'Callback endpoint for GitHub OAuth process',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to frontend1 application after OAuth',
  })
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req, @Res() res: FastifyReply) {
    try {
      const user = req.user;
      const accessToken = user?.accessToken;

      if (!user) {
        return res
          .status(302)
          .redirect(
            `${CONSTANTS.FRONTEND_URL}/auth/error?message=No user found`,
          );
      }

      if (!accessToken) {
        return res
          .status(302)
          .redirect(
            `${CONSTANTS.FRONTEND_URL}/auth/error?message=No access token`,
          );
      }

      try {
        await this.authService.handleGithubLogin(
          user,
          accessToken,
          res,
        );
      } catch (loginError) {
        return res
          .status(302)
          .redirect(
            `${CONSTANTS.FRONTEND_URL}/auth/error?message=Login handling error`,
          );
      }

      const frontendUrl = CONSTANTS.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/`;

      return res.status(302).redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = CONSTANTS.FRONTEND_URL || 'http://localhost:3000';
      return res
        .status(302)
        .redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve information about the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile information',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  getProfile(@GetUser() user) {
    return user;
  }
}
