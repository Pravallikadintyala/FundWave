/**
 * Auth request validators.
 *
 * Uses plain TypeScript validation — no additional library needed.
 * Returns structured validation errors rather than throwing, so the
 * middleware can decide how to respond.
 *
 * These run as Express middleware before the controller is reached,
 * keeping controllers free of input-checking logic.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';

const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;

/** Validates POST /api/auth/signup body */
export const validateSignup = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { username, password } = req.body as { username?: unknown; password?: unknown };

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return next(new AppError('Username is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (username.trim().length < MIN_USERNAME_LENGTH) {
    return next(
      new AppError(
        `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (username.trim().length > MAX_USERNAME_LENGTH) {
    return next(
      new AppError(
        `Username must be at most ${MAX_USERNAME_LENGTH} characters`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return next(new AppError('Password is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return next(
      new AppError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  next();
};

/** Validates POST /api/auth/login body */
export const validateLogin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { username, password } = req.body as { username?: unknown; password?: unknown };

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return next(new AppError('Username is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return next(new AppError('Password is required', HTTP_STATUS.BAD_REQUEST));
  }

  next();
};
