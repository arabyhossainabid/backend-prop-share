/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import multer from 'multer';
import { ZodError } from 'zod';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import { handleZodError } from '../errorHelpers/handleZodError';
import { TErrorResponse, TErrorSources } from '../interfaces/error.interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === 'development') {
    console.log('Error from Global Error Handler:', err);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR as number;
  let message = 'Internal Server Error';
  let stack: string | undefined = undefined;

  // Validation errors are transformed into a consistent field-error structure.
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  // Multer errors are mapped to clear client-facing upload messages.
  } else if (err instanceof multer.MulterError) {
    statusCode = status.BAD_REQUEST as number;
    stack = err.stack;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds 5MB limit';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field. Use a single file field named "file".';
    } else {
      message = err.message;
    }

    errorSources = [{ path: err.field || 'file', message }];
  // Custom AppError represents expected business/domain failures.
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  // Fallback for unhandled runtime errors.
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR as number;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  }

  // Keep error internals visible only in development for easier debugging.
  const errorResponse: TErrorResponse = {
    statusCode,
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === 'development' ? err : undefined,
    stack: envVars.NODE_ENV === 'development' ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
