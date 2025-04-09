import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import CONSTANTS from "../../config/constants";
import {AuthService} from "../services/auth.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
  ) {
    super({
      clientID: CONSTANTS.GITHUB_CLIENT_ID,
      clientSecret: CONSTANTS.GITHUB_CLIENT_SECRET,
      callbackURL: CONSTANTS.GITHUB_CALLBACK_URL,
      scope: ['user:email', 'read:user', 'repo'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const user = await this.authService.validateGithubUser(profile);

      const userWithToken = {
        ...user,
        accessToken,
      };

      done(null, userWithToken);
    } catch (error) {
      done(error, false);
    }
  }
}