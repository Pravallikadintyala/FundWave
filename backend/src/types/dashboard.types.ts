/**
 * Dashboard module TypeScript interfaces.
 *
 * Shared by dashboard.service and dashboard.controller.
 * All values are calculated on-the-fly from Transaction data —
 * nothing is persisted.
 */

import { TransactionData } from './finance.types';

// ─── Summary ──────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  transactionCount: number;
}

// ─── Expense by Category ──────────────────────────────────────────────────────

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

// ─── Income vs Expense (monthly) ─────────────────────────────────────────────

export interface MonthlyIncomeVsExpense {
  month: string;   // e.g. "Jan", "Feb"
  income: number;
  expense: number;
}

// ─── Savings summary ─────────────────────────────────────────────────────────

export interface SavingsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalSaved: number;
}

// ─── Full dashboard response ──────────────────────────────────────────────────

export interface DashboardData {
  summary: DashboardSummary;
  expenseByCategory: ExpenseByCategory[];
  incomeVsExpense: MonthlyIncomeVsExpense[];
  recentTransactions: TransactionData[];
  savings: SavingsSummary;
}
