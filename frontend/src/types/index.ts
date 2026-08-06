/**
 * Shared frontend TypeScript types.
 * Mirror the backend response shapes exactly.
 */

// ─── API envelope ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  currency: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export type TransactionType = 'Income' | 'Expense';

export interface Category {
  id: string;
  user: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  user: string;
  category: string | Category;
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  transactionCount: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface MonthlyIncomeVsExpense {
  month: string;
  income: number;
  expense: number;
}

export interface SavingsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalSaved: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  expenseByCategory: ExpenseByCategory[];
  incomeVsExpense: MonthlyIncomeVsExpense[];
  recentTransactions: Transaction[];
  savings: SavingsSummary;
}

// ─── Savings Goals ────────────────────────────────────────────────────────────

export type SavingsGoalStatus = 'Active' | 'Completed' | 'Archived';

export interface SavingsGoal {
  id: string;
  user: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  remainingAmount: number;
  targetDate?: string;
  color?: string;
  icon?: string;
  status: SavingsGoalStatus;
  createdAt?: string;
  updatedAt?: string;
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export interface AIInsights {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  savingsTip: string;
  overallScore: number;
}
