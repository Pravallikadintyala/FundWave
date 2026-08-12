import { Types } from 'mongoose';
export declare const SAVINGS_GOAL_STATUSES: readonly ["Active", "Completed", "Archived"];
export type SavingsGoalStatus = (typeof SAVINGS_GOAL_STATUSES)[number];
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
export interface SavingsGoalData {
    id: string;
    user: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    progressPercent: number;
    remainingAmount: number;
    targetDate?: Date;
    color?: string;
    icon?: string;
    status: SavingsGoalStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateSavingsGoalBody {
    title: string;
    targetAmount: number;
    targetDate?: string;
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
//# sourceMappingURL=savings.types.d.ts.map