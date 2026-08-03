/**
 * Savings Goals module TypeScript interfaces.
 */

import { Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const SAVINGS_GOAL_STATUSES = ['Active', 'Completed', 'Archived'] as const;
export type SavingsGoalStatus = (typeof SAVINGS_GOAL_STATUSES)[number];

// ─── Mongoose document ────────────────────────────────────────────────────────

export interface ISavingsGoal {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  color?: string;
  icon?: string;
  status: SavingsGoalStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Public API shape ─────────────────────────────────────────────────────────

export interface SavingsGoalData {
  id: string;
  user: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;      // (currentAmount / targetAmount) * 100, rounded to 2dp
  remainingAmount: number;      // targetAmount - currentAmount
  targetDate?: Date;
  color?: string;
  icon?: string;
  status: SavingsGoalStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface CreateSavingsGoalBody {
  title: string;
  targetAmount: number;
  targetDate?: string;          // ISO 8601 string from client
  color?: string;
  icon?: string;
}

export interface UpdateSavingsGoalBody {
  title?: string;
  targetAmount?: number;
  targetDate?: string;
  color?: string;
  icon?: string;
  status?: SavingsGoalStatus;
}

export interface ContributeBody {
  amount: number;
}
