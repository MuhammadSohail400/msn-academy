import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { AuthenticatedUserPayload } from '../@types/express';

export function signAccessToken(payload: AuthenticatedUserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: Pick<AuthenticatedUserPayload, 'id'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthenticatedUserPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthenticatedUserPayload;
}

export function verifyRefreshToken(token: string): Pick<AuthenticatedUserPayload, 'id'> {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Pick<AuthenticatedUserPayload, 'id'>;
}
