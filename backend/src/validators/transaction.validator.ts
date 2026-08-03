/**
 * Transaction request validators.
 *
 * Run as Express middleware before the transaction controller.
 * Validates ObjectIds, types, amounts, and required fields.
 */

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { TRANSACTION_TYPES } from '../types/finance.types';

/** Validates POST /api/transactions body. */
export const validateCreateTransaction = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { category, type, amount, transactionDate } = req.body as {
    category?: unknown;
    type?: unknown;
    amount?: unknown;
    transactionDate?: unknown;
  };

  // category
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return next(new AppError('Category is required', HTTP_STATUS.BAD_REQUEST));
  }

  if (!Types.ObjectId.isValid(category)) {
    return next(new AppError('Category must be a valid ID', HTTP_STATUS.BAD_REQUEST));
  }

  // type
  if (!type || !TRANSACTION_TYPES.includes(type as 'Income' | 'Expense')) {
    return next(
      new AppError(
        `Type must be one of: ${TRANSACTION_TYPES.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  // amount
  if (amount === undefined || amount === null) {
    return next(new AppError('Amount is required', HTTP_STATUS.BAD_REQUEST));
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return next(new AppError('Amount must be a number greater than zero', HTTP_STATUS.BAD_REQUEST));
  }

  // transactionDate
  if (!transactionDate || typeof transactionDate !== 'string' || transactionDate.trim().length === 0) {
    return next(new AppError('Transaction date is required', HTTP_STATUS.BAD_REQUEST));
  }

  const parsedDate = new Date(transactionDate);
  if (isNaN(parsedDate.getTime())) {
    return next(new AppError('Transaction date must be a valid date', HTTP_STATUS.BAD_REQUEST));
  }

  next();
};

/** Validates PUT /api/transactions/:id body. */
export const validateUpdateTransaction = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { category, type, amount, transactionDate } = req.body as {
    category?: unknown;
    type?: unknown;
    amount?: unknown;
    transactionDate?: unknown;
  };

  const hasUpdatableField =
    category !== undefined ||
    type !== undefined ||
    amount !== undefined ||
    transactionDate !== undefined ||
    'description' in req.body;

  if (!hasUpdatableField) {
    return next(
      new AppError(
        'At least one field is required (category, type, amount, description, transactionDate)',
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || !Types.ObjectId.isValid(category)) {
      return next(new AppError('Category must be a valid ID', HTTP_STATUS.BAD_REQUEST));
    }
  }

  if (type !== undefined) {
    if (!TRANSACTION_TYPES.includes(type as 'Income' | 'Expense')) {
      return next(
        new AppError(
          `Type must be one of: ${TRANSACTION_TYPES.join(', ')}`,
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }
  }

  if (amount !== undefined) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return next(
        new AppError('Amount must be a number greater than zero', HTTP_STATUS.BAD_REQUEST),
      );
    }
  }

  if (transactionDate !== undefined) {
    const parsedDate = new Date(transactionDate as string);
    if (isNaN(parsedDate.getTime())) {
      return next(new AppError('Transaction date must be a valid date', HTTP_STATUS.BAD_REQUEST));
    }
  }

  next();
};

/** Validates query parameters for GET /api/transactions. */
export const validateTransactionQuery = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { type, category, startDate, endDate } = req.query as {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  };

  if (type !== undefined && !TRANSACTION_TYPES.includes(type as 'Income' | 'Expense')) {
    return next(
      new AppError(
        `type query param must be one of: ${TRANSACTION_TYPES.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (category !== undefined && !Types.ObjectId.isValid(category)) {
    return next(new AppError('category query param must be a valid ID', HTTP_STATUS.BAD_REQUEST));
  }

  if (startDate !== undefined) {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) {
      return next(new AppError('startDate must be a valid date', HTTP_STATUS.BAD_REQUEST));
    }
  }

  if (endDate !== undefined) {
    const d = new Date(endDate);
    if (isNaN(d.getTime())) {
      return next(new AppError('endDate must be a valid date', HTTP_STATUS.BAD_REQUEST));
    }
  }

  next();
};
