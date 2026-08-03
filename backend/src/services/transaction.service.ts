/**
 * Transaction service — all transaction business logic lives here.
 *
 * Zero Express knowledge (no req/res/next).
 * Called by the transaction controller only.
 *
 * Rules enforced here:
 *  - Amount must be > 0.
 *  - Transaction type must match the category type.
 *  - Users can only access their own transactions.
 *  - Filtering by type, category, and date range is supported.
 */

import { Types } from 'mongoose';
import { Transaction, Category } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  ITransaction,
  ICategory,
  TransactionData,
  CategoryData,
  CreateTransactionBody,
  UpdateTransactionBody,
  TransactionQuery,
} from '../types/finance.types';

// ─── Private helper ───────────────────────────────────────────────────────────

type PopulatedTransaction = Omit<ITransaction, 'category'> & {
  category: ICategory | Types.ObjectId;
};

const toCategoryData = (cat: ICategory): CategoryData => ({
  id: cat._id.toString(),
  user: cat.user.toString(),
  name: cat.name,
  type: cat.type,
  icon: cat.icon,
  color: cat.color,
  isDefault: cat.isDefault,
  createdAt: cat.createdAt,
  updatedAt: cat.updatedAt,
});

const toTransactionData = (tx: PopulatedTransaction): TransactionData => {
  const cat = tx.category;
  const categoryField: string | CategoryData =
    cat && typeof cat === 'object' && 'name' in cat
      ? toCategoryData(cat as ICategory)
      : (cat as Types.ObjectId).toString();

  return {
    id: tx._id.toString(),
    user: tx.user.toString(),
    category: categoryField,
    type: tx.type,
    amount: tx.amount,
    description: tx.description,
    transactionDate: tx.transactionDate,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
};

/**
 * Resolve and validate a category ID for the given user and expected type.
 * Throws 404 if not found, 422 if types don't match.
 */
const resolveCategory = async (
  userId: string,
  categoryId: string,
  transactionType: string,
) => {
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new AppError('Invalid category ID', HTTP_STATUS.BAD_REQUEST);
  }

  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  if (category.type !== transactionType) {
    throw new AppError(
      `Category type "${category.type}" does not match transaction type "${transactionType}"`,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
    );
  }

  return category;
};

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * Create a new transaction for the authenticated user.
 */
export const createTransaction = async (
  userId: string,
  body: CreateTransactionBody,
): Promise<TransactionData> => {
  await resolveCategory(userId, body.category, body.type);

  const transaction = await Transaction.create({
    user: userId,
    category: body.category,
    type: body.type,
    amount: body.amount,
    description: body.description?.trim(),
    transactionDate: new Date(body.transactionDate),
  });

  const populated = await Transaction.findById(transaction._id).populate('category');
  return toTransactionData(populated as unknown as PopulatedTransaction);
};

/**
 * Get all transactions for the authenticated user with optional filters.
 */
export const getTransactions = async (
  userId: string,
  query: TransactionQuery,
): Promise<TransactionData[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { user: userId };

  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    if (!Types.ObjectId.isValid(query.category)) {
      throw new AppError('Invalid category ID', HTTP_STATUS.BAD_REQUEST);
    }
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.transactionDate = {};
    if (query.startDate) {
      filter.transactionDate.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.transactionDate.$lte = new Date(query.endDate);
    }
  }

  const transactions = await Transaction.find(filter)
    .populate('category')
    .sort({ transactionDate: -1, createdAt: -1 });

  return transactions.map((tx) => toTransactionData(tx as unknown as PopulatedTransaction));
};

/**
 * Get a single transaction by ID scoped to the authenticated user.
 * Throws 404 if not found or belongs to another user.
 */
export const getTransactionById = async (
  userId: string,
  transactionId: string,
): Promise<TransactionData> => {
  if (!Types.ObjectId.isValid(transactionId)) {
    throw new AppError('Invalid transaction ID', HTTP_STATUS.BAD_REQUEST);
  }

  const transaction = await Transaction.findOne({ _id: transactionId, user: userId }).populate(
    'category',
  );

  if (!transaction) {
    throw new AppError('Transaction not found', HTTP_STATUS.NOT_FOUND);
  }

  return toTransactionData(transaction as unknown as PopulatedTransaction);
};

/**
 * Update a transaction owned by the authenticated user.
 * If category or type changes, re-validates that they still match.
 */
export const updateTransaction = async (
  userId: string,
  transactionId: string,
  body: UpdateTransactionBody,
): Promise<TransactionData> => {
  if (!Types.ObjectId.isValid(transactionId)) {
    throw new AppError('Invalid transaction ID', HTTP_STATUS.BAD_REQUEST);
  }

  const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

  if (!transaction) {
    throw new AppError('Transaction not found', HTTP_STATUS.NOT_FOUND);
  }

  // Determine the effective type and category after updates
  const effectiveType = body.type ?? transaction.type;
  const effectiveCategoryId = body.category ?? transaction.category.toString();

  // If either type or category changes, re-validate the combination
  if (body.type !== undefined || body.category !== undefined) {
    await resolveCategory(userId, effectiveCategoryId, effectiveType);
  }

  if (body.category !== undefined) transaction.category = new Types.ObjectId(body.category);
  if (body.type !== undefined) transaction.type = body.type;
  if (body.amount !== undefined) transaction.amount = body.amount;
  if (body.description !== undefined) transaction.description = body.description.trim();
  if (body.transactionDate !== undefined)
    transaction.transactionDate = new Date(body.transactionDate);

  await transaction.save();

  const populated = await Transaction.findById(transaction._id).populate('category');
  return toTransactionData(populated as unknown as PopulatedTransaction);
};

/**
 * Delete a transaction owned by the authenticated user.
 * Throws 404 if not found or belongs to another user.
 */
export const deleteTransaction = async (
  userId: string,
  transactionId: string,
): Promise<void> => {
  if (!Types.ObjectId.isValid(transactionId)) {
    throw new AppError('Invalid transaction ID', HTTP_STATUS.BAD_REQUEST);
  }

  const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

  if (!transaction) {
    throw new AppError('Transaction not found', HTTP_STATUS.NOT_FOUND);
  }

  await transaction.deleteOne();
};
