/**
 * transactionService — thin API layer over transaction and category endpoints.
 *
 * Maps one-to-one to backend routes:
 *   GET    /transactions          → getTransactions
 *   POST   /transactions          → createTransaction
 *   PUT    /transactions/:id      → updateTransaction
 *   DELETE /transactions/:id      → deleteTransaction
 *   GET    /categories            → getCategories
 *
 * No business logic. No state. Called only by useTransactions hook.
 */

import { apiClient } from '@/api/axiosClient';
import type { ApiResponse, Transaction, Category } from '@/types';

// ─── Payload shapes ────────────────────────────────────────────────────────────

export interface CreateTransactionPayload {
  type: 'Income' | 'Expense';
  category: string;           // category id
  amount: number;
  description?: string;
  transactionDate: string;    // ISO date string
  notes?: string;
}

export interface UpdateTransactionPayload {
  type?: 'Income' | 'Expense';
  category?: string;
  amount?: number;
  description?: string;
  transactionDate?: string;
  notes?: string;
}

export interface TransactionFilters {
  type?: 'Income' | 'Expense';
  category?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}

// ─── Response shapes ───────────────────────────────────────────────────────────

interface TransactionsResponse {
  transactions: Transaction[];
}

interface TransactionResponse {
  transaction: Transaction;
}

interface CategoriesResponse {
  categories: Category[];
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const transactionService = {
  /**
   * GET /transactions
   * Returns all transactions for the authenticated user.
   */
  getTransactions: (filters?: TransactionFilters) =>
    apiClient.get<ApiResponse<TransactionsResponse>>('/transactions', {
      params: filters,
    }),

  /**
   * POST /transactions
   * Creates a new transaction.
   */
  createTransaction: (payload: CreateTransactionPayload) =>
    apiClient.post<ApiResponse<TransactionResponse>>('/transactions', payload),

  /**
   * PUT /transactions/:id
   * Updates an existing transaction.
   */
  updateTransaction: (id: string, payload: UpdateTransactionPayload) =>
    apiClient.put<ApiResponse<TransactionResponse>>(`/transactions/${id}`, payload),

  /**
   * DELETE /transactions/:id
   * Deletes a transaction.
   */
  deleteTransaction: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/transactions/${id}`),

  /**
   * GET /categories
   * Returns all categories for the authenticated user.
   */
  getCategories: () =>
    apiClient.get<ApiResponse<CategoriesResponse>>('/categories'),
};
