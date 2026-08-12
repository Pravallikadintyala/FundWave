/**
 * Auth request validators.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

/** Validates POST /api/auth/signup body */
export const validateSignup = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { email, password, fullName } = req.body as { email?: unknown; password?: unknown; fullName?: unknown };

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return next(new AppError('A valid email is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return next(new AppError('Full name is required', HTTP_STATUS.BAD_REQUEST));
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
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return next(new AppError('A valid email is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return next(new AppError('Password is required', HTTP_STATUS.BAD_REQUEST));
  }

  next();
};
