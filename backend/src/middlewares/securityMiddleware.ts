import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(_: Request, res: Response, next: NextFunction) {
    // res.setHeader('X-Frame-Options', 'DENY');
    // res.setHeader('X-XSS-Protection', '1; mode=block');
    // res.setHeader(
    //   'Content-Security-Policy',
    //   "default-src 'self'; script-src 'self'",
    // );
    next();
  }
}
