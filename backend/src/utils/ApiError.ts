export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: ValidationErrorDetail[];

  constructor(statusCode: number, message: string, errors?: ValidationErrorDetail[], isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string = 'Bad request', errors?: ValidationErrorDetail[]): ApiError {
    return new ApiError(400, message, errors);
  }

  public static unauthorized(message: string = 'Authentication required'): ApiError {
    return new ApiError(401, message);
  }

  public static forbidden(message: string = 'Access forbidden'): ApiError {
    return new ApiError(403, message);
  }

  public static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  public static conflict(message: string = 'Resource conflict'): ApiError {
    return new ApiError(409, message);
  }

  public static unprocessable(message: string = 'Validation failed', errors?: ValidationErrorDetail[]): ApiError {
    return new ApiError(422, message, errors);
  }

  public static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(500, message, undefined, false);
  }
}

export default ApiError;
