/**
 * Category request validators.
 *
 * Run as Express middleware before the category controller.
 * Uses AppError for consistent error responses per CLAUDE.md.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { TRANSACTION_TYPES } from '../types/finance.types';

/** Validates POST /api/categories body. */
export const validateCreateCategory = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { name, type } = req.body as { name?: unknown; type?: unknown };

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Category name is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (name.trim().length > 50) {
    return next(
      new AppError('Category name must be at most 50 characters', HTTP_STATUS.BAD_REQUEST),
    );
  }

  if (!type || !TRANSACTION_TYPES.includes(type as 'Income' | 'Expense')) {
    return next(
      new AppError(
        `Type must be one of: ${TRANSACTION_TYPES.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  next();
};

/** Validates PUT /api/categories/:id body. */
export const validateUpdateCategory = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { name, icon, color } = req.body as {
    name?: unknown;
    icon?: unknown;
    color?: unknown;
  };

  const hasUpdatableField =
    name !== undefined || icon !== undefined || color !== undefined;

  if (!hasUpdatableField) {
    return next(
      new AppError(
        'At least one updatable field is required (name, icon, color)',
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return next(new AppError('Category name must be a non-empty string', HTTP_STATUS.BAD_REQUEST));
    }
    if (name.trim().length > 50) {
      return next(
        new AppError('Category name must be at most 50 characters', HTTP_STATUS.BAD_REQUEST),
      );
    }
  }

  next();
};
