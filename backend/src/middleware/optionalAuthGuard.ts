import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function optionalAuthGuard(req: Request, res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch {
        // Token invalid/expired; continue unauthenticated
      }
    }

    next();
  } catch {
    next();
  }
}

export default optionalAuthGuard;
