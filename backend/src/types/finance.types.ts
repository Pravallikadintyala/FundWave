/**
 * Finance module TypeScript interfaces and types.
 *
 * Covers Categories and Transactions.
 * Shared by models, services, validators, and controllers.
 */

import { Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const TRANSACTION_TYPES = ['Income', 'Expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// ─── Category ─────────────────────────────────────────────────────────────────

/** Shape of a Category document stored in MongoDB. */
export interface ICategory {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Public category shape returned from the API. */
export interface CategoryData {
  id: string;
  user: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/** POST /api/categories request body. */
export interface CreateCategoryBody {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

/** PUT /api/categories/:id request body. */
export interface UpdateCategoryBody {
  name?: string;
  icon?: string;
  color?: string;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

/** Shape of a Transaction document stored in MongoDB. */
export interface ITransaction {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  category: Types.ObjectId;
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Public transaction shape returned from the API. */
export interface TransactionData {
  id: string;
  user: string;
  category: string | CategoryData;
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/** POST /api/transactions request body. */
export interface CreateTransactionBody {
  category: string;
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: string;
}

/** PUT /api/transactions/:id request body. */
export interface UpdateTransactionBody {
  category?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  transactionDate?: string;
}

/** Query parameters for GET /api/transactions. */
export interface TransactionQuery {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
}
