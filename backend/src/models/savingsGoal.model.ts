/**
 * SavingsGoal Mongoose model.
 *
 * Each goal belongs to a user.
 * currentAmount cannot exceed targetAmount (enforced at service layer).
 * Status auto-transitions to Completed when currentAmount reaches targetAmount.
 */

import { Schema, model, Model } from 'mongoose';
import { ISavingsGoal, SAVINGS_GOAL_STATUSES } from '../types/savings.types';

const savingsGoalSchema = new Schema<ISavingsGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0.01, 'Target amount must be greater than zero'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    targetDate: {
      type: Date,
    },
    color: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: SAVINGS_GOAL_STATUSES,
        message: `Status must be one of: ${SAVINGS_GOAL_STATUSES.join(', ')}`,
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SavingsGoal: Model<ISavingsGoal> = model<ISavingsGoal>('SavingsGoal', savingsGoalSchema);

// Compound index: supports getSavingsGoals(userId) which sorts by createdAt DESC
savingsGoalSchema.index({ user: 1, createdAt: -1 });

export default SavingsGoal;
