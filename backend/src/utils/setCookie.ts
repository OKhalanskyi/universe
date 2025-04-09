import { FastifyReply } from 'fastify';
import { CookieOptions } from 'express';
import CONSTANTS from "../config/constants";

const isDevelopment = process.env.NODE_ENV === 'development';

export const setCookie = (
  res: FastifyReply,
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  res.setCookie(`${name}`, value, {
    path: CONSTANTS.COOKIES_PATH,
    secure: !isDevelopment,
    sameSite: isDevelopment ? false : 'none',
    httpOnly: true,
    ...options,
  });
};
