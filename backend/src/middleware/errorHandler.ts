/**
 * Global error-handling middleware.
 *
 * Must be registered LAST in Express (after all routes and other middleware)
 * and must accept exactly 4 arguments so Express identifies it as an
 * error handler.
 *
 * Distinguishes between:
 *   - Operational AppErrors  → expose message to client
 *   - Mongoose validation errors → map to 400
 *   - Mongoose duplicate key (11000) → map to 409
 *   - Unknown programmer errors → return generic 500 (never leak details)
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { config } from '../config/env';

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = 'An unexpected error occurred';

  // --- Operational AppError ---
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // --- Mongoose Validation Error ---
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  // --- Mongoose Duplicate Key Error ---
  else if ((err as NodeJS.ErrnoException).code === '11000') {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'A resource with the provided value already exists';
  }

  // --- Mongoose Cast Error (invalid ObjectId) ---
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid value for field: ${err.path}`;
  }

  // Log non-operational errors fully in development
  if (!config.isProduction) {
    console.error('💥 ERROR:', err);
  }

  const body: ErrorResponse = { success: false, message };

  // Only expose stack trace in development
  if (config.isDevelopment && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
