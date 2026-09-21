import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError, ValidationErrorDetail } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { env } from '../config/environment';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // 1. Handled Operational ApiError (400, 401, 403, 404, 409, 422, etc.)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      statusCode: err.statusCode,
    });
    return;
  }

  // 2. Zod Schema Validation Error (HTTP 422)
  if (err instanceof ZodError) {
    const errors: ValidationErrorDetail[] = err.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
    }));

    res.status(422).json({
      success: false,
      message: 'Request validation failed',
      errors,
      statusCode: 422,
    });
    return;
  }

  // 3. Mongoose Schema Validation Error (HTTP 422)
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: ValidationErrorDetail[] = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    res.status(422).json({
      success: false,
      message: 'Database validation failed',
      errors,
      statusCode: 422,
    });
    return;
  }

  // 4. Mongoose Duplicate Key Error (HTTP 409)
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
    const keyPattern = (err as { keyPattern?: Record<string, number> }).keyPattern;
    const field = keyPattern ? Object.keys(keyPattern)[0] : 'record';
    res.status(409).json({
      success: false,
      message: `A resource with this ${field} already exists.`,
      errors: [{ field, message: `${field} is already in use` }],
      statusCode: 409,
    });
    return;
  }

  // 5. Mongoose Invalid ObjectId CastError (HTTP 400)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid format for identifier '${err.path}'`,
      errors: [{ field: err.path, message: `Invalid ObjectId format: ${err.value}` }],
      statusCode: 400,
    });
    return;
  }

  // 6. JWT Authentication Errors (HTTP 401)
  if (typeof err === 'object' && err !== null && 'name' in err) {
    const name = (err as { name: string }).name;
    if (name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid session token',
        errors: [],
        statusCode: 401,
      });
      return;
    }
    if (name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Session token has expired',
        errors: [],
        statusCode: 401,
      });
      return;
    }
  }

  // 7. Unhandled Server Error (HTTP 500)
  const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
  logger.error({ err, path: req.path, method: req.method }, `Unhandled Exception: ${errorMessage}`);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : errorMessage,
    errors: [],
    statusCode: 500,
  });
}

export default errorHandler;
