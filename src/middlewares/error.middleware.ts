import env from '@/config/env.js';
import { ApiError } from '@/utils/ApiError.js';
import { HTTP_STATUS } from '@/utils/constants.js';
import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  stack?: string;
}

function handleZodError(err: ZodError): ApiError {
  const errors = err.issues.map(issue => {
    const base: { field?: string; message: string } = {
      message: issue.message,
    };

    if (issue.path.length) {
      base.field = issue.path.join('.');
    }

    return base;
  });

  return new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors);
}

function handleMongooseValidationError(
  err: mongoose.Error.ValidationError,
): ApiError {
  const errors = Object.entries(err.errors).map(([field, error]) => ({
    field,
    message: error.message,
  }));

  return new ApiError(
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    'Validation failed',
    errors,
  );
}

function handleMongooseCastError(err: mongoose.Error.CastError): ApiError {
  return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
}

function handleMongoDuplicateKeyError(
  err: Record<string, unknown>,
): ApiError {
  const keyValue = err['keyValue'] as Record<string, unknown> | undefined;
  const field = keyValue ? Object.keys(keyValue)[0] : 'unknown';

  return ApiError.conflict(`Duplicate value for field: ${field}`);
}

function handleJwtError(): ApiError {
  return ApiError.unauthorized('Invalid or expired token');
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof ZodError) {
    error = handleZodError(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    error = handleMongooseValidationError(err);
  } else if (err instanceof mongoose.Error.CastError) {
    error = handleMongooseCastError(err);
  } else if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as Record<string, unknown>)['code'] === 11000
  ) {
    error = handleMongoDuplicateKeyError(err as Record<string, unknown>);
  } else if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    error = handleJwtError();
  } else {
    // Unknown error — treat as internal server error
    console.error('Unexpected error:', err);
    error = ApiError.internal();
  }

  // Log non-operational errors (programmer errors / bugs)
  if (!error.isOperational) {
    console.error('Non-operational error:', err);
  }

  const responseBody: ErrorResponseBody = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(error.statusCode).json(responseBody);
}
