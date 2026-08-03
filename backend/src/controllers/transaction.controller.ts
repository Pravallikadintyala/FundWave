/**
 * Transaction controller — thin HTTP layer over the transaction service.
 *
 * Per CLAUDE.md: controllers only validate requests and call services.
 * All business logic lives in src/services/transaction.service.ts.
 *
 * All routes require the `protect` middleware (set at router level).
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../services/transaction.service';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  CreateTransactionBody,
  UpdateTransactionBody,
  TransactionQuery,
} from '../types/finance.types';

/**
 * POST /api/transactions
 * Creates a new transaction for the authenticated user.
 */
export const createTransactionHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = req.body as CreateTransactionBody;
    const transaction = await createTransaction(req.user.id, body);
    sendSuccess(res, { transaction }, HTTP_STATUS.CREATED);
  },
);

/**
 * GET /api/transactions
 * Returns all transactions for the authenticated user with optional filters.
 */
export const getTransactionsHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const query = req.query as unknown as TransactionQuery;
    const transactions = await getTransactions(req.user.id, query);
    sendSuccess(res, { transactions });
  },
);

/**
 * GET /api/transactions/:id
 * Returns a single transaction by ID, scoped to the authenticated user.
 */
export const getTransactionByIdHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const transaction = await getTransactionById(req.user.id, req.params.id);
    sendSuccess(res, { transaction });
  },
);

/**
 * PUT /api/transactions/:id
 * Updates a transaction owned by the authenticated user.
 */
export const updateTransactionHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = req.body as UpdateTransactionBody;
    const transaction = await updateTransaction(req.user.id, req.params.id, body);
    sendSuccess(res, { transaction });
  },
);

/**
 * DELETE /api/transactions/:id
 * Deletes a transaction owned by the authenticated user.
 */
export const deleteTransactionHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    await deleteTransaction(req.user.id, req.params.id);
    sendSuccess(res, { message: 'Transaction deleted successfully' });
  },
);
