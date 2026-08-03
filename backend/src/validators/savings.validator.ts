/**
 * Savings Goals request validators.
 * Runs as Express middleware before controllers.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { SAVINGS_GOAL_STATUSES, UpdateSavingsGoalBody } from '../types/savings.types';

const EDITABLE_FIELDS = ['title', 'targetAmount', 'targetDate', 'color', 'icon', 'status'] as const;

// ─── Create ───────────────────────────────────────────────────────────────────

export const validateCreateSavingsGoal = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { title, targetAmount } = req.body as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(new AppError('title is required', HTTP_STATUS.BAD_REQUEST));
  }
  if (title.toString().trim().length > 100) {
    return next(new AppError('title must be at most 100 characters', HTTP_STATUS.BAD_REQUEST));
  }

  if (targetAmount === undefined || targetAmount === null) {
    return next(new AppError('targetAmount is required', HTTP_STATUS.BAD_REQUEST));
  }
  const amount = Number(targetAmount);
  if (isNaN(amount) || amount <= 0) {
    return next(new AppError('targetAmount must be a number greater than zero', HTTP_STATUS.BAD_REQUEST));
  }

  next();
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const validateUpdateSavingsGoal = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const body = req.body as Record<string, unknown>;

  // Reject unknown fields
  const unknown = Object.keys(body).filter((k) => !EDITABLE_FIELDS.includes(k as typeof EDITABLE_FIELDS[number]));
  if (unknown.length > 0) {
    return next(new AppError(`Unknown field(s): ${unknown.join(', ')}`, HTTP_STATUS.BAD_REQUEST));
  }

  if (Object.keys(body).length === 0) {
    return next(new AppError('At least one field is required', HTTP_STATUS.BAD_REQUEST));
  }

  const { title, targetAmount, status } = body as UpdateSavingsGoalBody;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return next(new AppError('title must be a non-empty string', HTTP_STATUS.BAD_REQUEST));
    }
    if (title.trim().length > 100) {
      return next(new AppError('title must be at most 100 characters', HTTP_STATUS.BAD_REQUEST));
    }
  }

  if (targetAmount !== undefined) {
    const amount = Number(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      return next(new AppError('targetAmount must be a number greater than zero', HTTP_STATUS.BAD_REQUEST));
    }
  }

  if (status !== undefined && !SAVINGS_GOAL_STATUSES.includes(status)) {
    return next(
      new AppError(`status must be one of: ${SAVINGS_GOAL_STATUSES.join(', ')}`, HTTP_STATUS.BAD_REQUEST),
    );
  }

  next();
};

// ─── Contribute ───────────────────────────────────────────────────────────────

export const validateContribute = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { amount } = req.body as Record<string, unknown>;

  if (amount === undefined || amount === null) {
    return next(new AppError('amount is required', HTTP_STATUS.BAD_REQUEST));
  }
  const val = Number(amount);
  if (isNaN(val) || val <= 0) {
    return next(new AppError('amount must be a number greater than zero', HTTP_STATUS.BAD_REQUEST));
  }

  next();
};
