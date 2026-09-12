import { Response, CookieOptions } from 'express';
import { env } from '../config/environment';

const isProduction = env.NODE_ENV === 'production';

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth/refresh', // Scoped to refresh endpoint for enhanced security
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { ...ACCESS_TOKEN_COOKIE_OPTIONS, maxAge: 0 });
  res.clearCookie('refresh_token', { ...REFRESH_TOKEN_COOKIE_OPTIONS, maxAge: 0 });
}
