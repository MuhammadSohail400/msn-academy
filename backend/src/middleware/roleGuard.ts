import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export type UserRole = 'STUDENT' | 'ADMIN';

export function roleGuard(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden('Access denied. You do not have sufficient permissions.');
    }

    next();
  };
}

export default roleGuard;
