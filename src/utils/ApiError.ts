import { HTTP_STATUS } from '@/utils/constants.js';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: Array<{ field?: string; message: string }>;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: Array<{ field?: string; message: string }> = [],
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    // Preserve proper stack trace in V8 engines
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(
    message: string = 'Bad request',
    errors: Array<{ field?: string; message: string }> = [],
  ): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string = 'Resource already exists'): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, [], false);
  }
}
