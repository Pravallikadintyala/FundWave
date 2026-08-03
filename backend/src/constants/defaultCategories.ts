/**
 * Default category seed data.
 *
 * Called once per new user registration (from auth.service).
 * isDefault = true prevents these from being deleted via the API.
 */

import { TransactionType } from '../types/finance.types';

interface DefaultCategory {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // ─── Income ───────────────────────────────────────────────────
  { name: 'Salary',      type: 'Income',  icon: '💼', color: '#4CAF50' },
  { name: 'Freelance',   type: 'Income',  icon: '💻', color: '#8BC34A' },
  { name: 'Business',    type: 'Income',  icon: '🏢', color: '#009688' },
  { name: 'Investment',  type: 'Income',  icon: '📈', color: '#00BCD4' },
  { name: 'Gift',        type: 'Income',  icon: '🎁', color: '#9C27B0' },
  { name: 'Other',       type: 'Income',  icon: '➕', color: '#607D8B' },

  // ─── Expense ──────────────────────────────────────────────────
  { name: 'Food',          type: 'Expense', icon: '🍔', color: '#FF5722' },
  { name: 'Rent',          type: 'Expense', icon: '🏠', color: '#F44336' },
  { name: 'Shopping',      type: 'Expense', icon: '🛍️', color: '#E91E63' },
  { name: 'Bills',         type: 'Expense', icon: '🧾', color: '#FF9800' },
  { name: 'Travel',        type: 'Expense', icon: '✈️', color: '#3F51B5' },
  { name: 'Fuel',          type: 'Expense', icon: '⛽', color: '#795548' },
  { name: 'Entertainment', type: 'Expense', icon: '🎬', color: '#673AB7' },
  { name: 'Healthcare',    type: 'Expense', icon: '🏥', color: '#2196F3' },
  { name: 'Education',     type: 'Expense', icon: '📚', color: '#009688' },
  { name: 'Other',         type: 'Expense', icon: '➖', color: '#9E9E9E' },
];
