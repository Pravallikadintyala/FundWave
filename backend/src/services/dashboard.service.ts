/**
 * Dashboard service — all analytics business logic lives here.
 *
 * Zero Express knowledge (no req/res/next).
 * Uses MongoDB Aggregation Pipelines for efficiency.
 *
 * Three aggregations are run in parallel via Promise.all:
 *   1. summary          — totalIncome, totalExpenses, currentBalance
 *   2. expenseByCategory — per-category expense totals (Pie Chart)
 *   3. incomeVsExpense   — per-month income + expense (Line Chart)
 *
 * A fourth lean query fetches the 5 most recent transactions.
 * All results are scoped strictly to the requesting user.
 */

import { Types } from 'mongoose';
import { Transaction } from '../models';
import {
  DashboardData,
  DashboardSummary,
  ExpenseByCategory,
  MonthlyIncomeVsExpense,
} from '../types/dashboard.types';
import { TransactionData, ITransaction, ICategory, CategoryData } from '../types/finance.types';
import { getSavingsSummary } from './savings.service';


// ─── Month label lookup ───────────────────────────────────────────────────────

const MONTH_LABELS: readonly string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─── Private helpers ──────────────────────────────────────────────────────────

/** Convert a populated transaction document to the public TransactionData shape. */
const toTransactionData = (
  tx: Omit<ITransaction, 'category'> & { category: ICategory | Types.ObjectId },
): TransactionData => {
  const cat = tx.category;
  const categoryField: string | CategoryData =
    cat && typeof cat === 'object' && 'name' in cat
      ? {
          id: (cat as ICategory)._id.toString(),
          user: (cat as ICategory).user.toString(),
          name: (cat as ICategory).name,
          type: (cat as ICategory).type,
          icon: (cat as ICategory).icon,
          color: (cat as ICategory).color,
          isDefault: (cat as ICategory).isDefault,
        }
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

// ─── Aggregation result shapes ────────────────────────────────────────────────

interface SummaryAggResult {
  _id: 'Income' | 'Expense';
  total: number;
  count: number;
}

interface ExpenseByCategoryAggResult {
  _id: string;           // category name
  total: number;
}

interface MonthlyAggResult {
  _id: { year: number; month: number; type: 'Income' | 'Expense' };
  total: number;
}

// ─── Service method ───────────────────────────────────────────────────────────

/**
 * Build the full dashboard payload for the given user.
 * All four data sets are resolved with as few round-trips as possible.
 */
export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  const userObjectId = new Types.ObjectId(userId);

  // ── Run all queries in parallel ──────────────────────────────────────────────
  const [summaryAgg, expenseByCategoryAgg, monthlyAgg, recentDocs, savings] = await Promise.all([


    // 1. Summary: total income, total expenses, and transaction count per type
    Transaction.aggregate<SummaryAggResult>([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),

    // 2. Expense by category: join with categories to get the name
    Transaction.aggregate<ExpenseByCategoryAggResult>([
      { $match: { user: userObjectId, type: 'Expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDoc',
        },
      },
      { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: '$categoryDoc.name',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),

    // 3. Income vs Expense per calendar month
    Transaction.aggregate<MonthlyAggResult>([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: {
            year:  { $year:  '$transactionDate' },
            month: { $month: '$transactionDate' },
            type:  '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // 4. Five most recent transactions (populated)
    Transaction.find({ user: userObjectId })
      .populate('category')
      .sort({ transactionDate: -1, createdAt: -1 })
      .limit(5)
      .lean<(Omit<ITransaction, 'category'> & { category: ICategory | Types.ObjectId })[]>(),
    // 5. Savings summary
    getSavingsSummary(userId),
  ]);


  // ── Build summary ────────────────────────────────────────────────────────────
  const totals: Record<string, { amount: number; count: number }> = {
    Income: { amount: 0, count: 0 },
    Expense: { amount: 0, count: 0 },
  };
  for (const row of summaryAgg) {
    totals[row._id] = { amount: row.total, count: row.count };
  }

  const summary: DashboardSummary = {
    totalIncome: totals['Income'].amount,
    totalExpenses: totals['Expense'].amount,
    currentBalance: totals['Income'].amount - totals['Expense'].amount,
    transactionCount: totals['Income'].count + totals['Expense'].count,
  };

  // ── Build expense by category ────────────────────────────────────────────────
  const expenseByCategory: ExpenseByCategory[] = expenseByCategoryAgg.map((row) => ({
    category: row._id,
    amount: row.total,
  }));

  // ── Build income vs expense (monthly) ────────────────────────────────────────
  //
  // The aggregation returns one document per (year, month, type) combination.
  // We merge them into a single entry per (year, month) keyed by "YYYY-MM".
  const monthlyMap = new Map<string, MonthlyIncomeVsExpense>();

  for (const row of monthlyAgg) {
    const { year, month, type } = row._id;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const label = MONTH_LABELS[month - 1];

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { month: label, income: 0, expense: 0 });
    }

    const entry = monthlyMap.get(key)!;
    if (type === 'Income') {
      entry.income = row.total;
    } else {
      entry.expense = row.total;
    }
  }

  // Sort chronologically by the map key ("YYYY-MM") and extract the values
  const incomeVsExpense: MonthlyIncomeVsExpense[] = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  // ── Build recent transactions ────────────────────────────────────────────────
  const recentTransactions: TransactionData[] = recentDocs.map((doc) =>
    toTransactionData(doc),
  );

  return {
    summary,
    expenseByCategory,
    incomeVsExpense,
    recentTransactions,
    savings,
  };
};

