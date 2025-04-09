import {PassportSerializer} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: Function) {
    done(null, { id: user.id });
  }

  deserializeUser(payload: any, done: Function) {
    done(null, payload);
  }
}