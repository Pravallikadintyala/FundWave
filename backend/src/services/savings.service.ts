/**
 * Savings Goals service — all business logic lives here.
 * Zero Express knowledge (no req/res/next).
 */

import { Types, HydratedDocument } from 'mongoose';

import { SavingsGoal } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  ISavingsGoal,
  SavingsGoalData,
  CreateSavingsGoalBody,
  UpdateSavingsGoalBody,
  ContributeBody,
} from '../types/savings.types';
import { SavingsSummary } from '../types/dashboard.types';

// ─── Private helper ───────────────────────────────────────────────────────────

const toGoalData = (doc: ISavingsGoal): SavingsGoalData => {
  const progressPercent =
    doc.targetAmount > 0
      ? Math.min(
          parseFloat(((doc.currentAmount / doc.targetAmount) * 100).toFixed(2)),
          100,
        )
      : 0;

  return {
    id: doc._id.toString(),
    user: doc.user.toString(),
    title: doc.title,
    targetAmount: doc.targetAmount,
    currentAmount: doc.currentAmount,
    progressPercent,
    remainingAmount: Math.max(doc.targetAmount - doc.currentAmount, 0),
    targetDate: doc.targetDate,
    color: doc.color,
    icon: doc.icon,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// ─── Ownership guard ──────────────────────────────────────────────────────────

const findOwnedGoal = async (
  goalId: string,
  userId: string,
): Promise<HydratedDocument<ISavingsGoal>> => {
  if (!Types.ObjectId.isValid(goalId)) {
    throw new AppError('Invalid savings goal ID', HTTP_STATUS.BAD_REQUEST);
  }

  const goal = await SavingsGoal.findOne({
    _id: new Types.ObjectId(goalId),
    user: new Types.ObjectId(userId),
  });

  if (!goal) {
    throw new AppError('Savings goal not found', HTTP_STATUS.NOT_FOUND);
  }

  return goal;
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const createSavingsGoal = async (
  userId: string,
  body: CreateSavingsGoalBody,
): Promise<SavingsGoalData> => {
  const goal = await SavingsGoal.create({
    user: new Types.ObjectId(userId),
    title: body.title.trim(),
    targetAmount: body.targetAmount,
    targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
    color: body.color?.trim(),
    icon: body.icon?.trim(),
  });

  return toGoalData(goal);
};

export const getSavingsGoals = async (userId: string): Promise<SavingsGoalData[]> => {
  const goals = await SavingsGoal.find({ user: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 });

  return goals.map(toGoalData);
};

export const getSavingsGoalById = async (
  goalId: string,
  userId: string,
): Promise<SavingsGoalData> => {
  const goal = await findOwnedGoal(goalId, userId);
  return toGoalData(goal);
};

export const updateSavingsGoal = async (
  goalId: string,
  userId: string,
  body: UpdateSavingsGoalBody,
): Promise<SavingsGoalData> => {
  const goal = await findOwnedGoal(goalId, userId);

  if (body.title !== undefined) goal.title = body.title.trim();
  if (body.targetAmount !== undefined) {
    // If new target is below currentAmount, clamp currentAmount
    goal.targetAmount = body.targetAmount;
    if (goal.currentAmount > goal.targetAmount) {
      goal.currentAmount = goal.targetAmount;
    }
    // Re-evaluate completion after target change
    if (goal.currentAmount >= goal.targetAmount && goal.status === 'Active') {
      goal.status = 'Completed';
    }
  }
  if (body.targetDate !== undefined) {
    goal.targetDate = body.targetDate ? new Date(body.targetDate) : undefined;
  }
  if (body.color !== undefined) goal.color = body.color.trim() || undefined;
  if (body.icon !== undefined) goal.icon = body.icon.trim() || undefined;
  if (body.status !== undefined) goal.status = body.status;

  await goal.save();
  return toGoalData(goal);
};

export const deleteSavingsGoal = async (goalId: string, userId: string): Promise<void> => {
  const goal = await findOwnedGoal(goalId, userId);
  await goal.deleteOne();
};

// ─── Contribute ───────────────────────────────────────────────────────────────

export const contribute = async (
  goalId: string,
  userId: string,
  body: ContributeBody,
): Promise<SavingsGoalData> => {
  const goal = await findOwnedGoal(goalId, userId);

  if (goal.status === 'Completed') {
    throw new AppError('This goal is already completed', HTTP_STATUS.BAD_REQUEST);
  }
  if (goal.status === 'Archived') {
    throw new AppError('Cannot contribute to an archived goal', HTTP_STATUS.BAD_REQUEST);
  }

  const newAmount = goal.currentAmount + body.amount;

  if (newAmount > goal.targetAmount) {
    throw new AppError(
      `Contribution of ${body.amount} exceeds the remaining amount of ${(goal.targetAmount - goal.currentAmount).toFixed(2)}`,
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  goal.currentAmount = newAmount;

  // Auto-complete when target is reached
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'Completed';
  }

  await goal.save();
  return toGoalData(goal);
};

// ─── Dashboard aggregation ────────────────────────────────────────────────────

interface SavingsAggResult {
  _id: string;     // status
  count: number;
  totalSaved: number;
}

export const getSavingsSummary = async (userId: string): Promise<SavingsSummary> => {
  const rows = await SavingsGoal.aggregate<SavingsAggResult>([
    { $match: { user: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalSaved: { $sum: '$currentAmount' },
      },
    },
  ]);

  let totalGoals = 0;
  let activeGoals = 0;
  let completedGoals = 0;
  let totalSaved = 0;

  for (const row of rows) {
    totalGoals += row.count;
    totalSaved += row.totalSaved;
    if (row._id === 'Active') activeGoals = row.count;
    if (row._id === 'Completed') completedGoals = row.count;
  }

  return { totalGoals, activeGoals, completedGoals, totalSaved };
};
