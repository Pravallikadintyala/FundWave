import { SavingsGoalData, CreateSavingsGoalBody, UpdateSavingsGoalBody, ContributeBody } from '../types/savings.types';
import { SavingsSummary } from '../types/dashboard.types';
export declare const createSavingsGoal: (userId: string, body: CreateSavingsGoalBody) => Promise<SavingsGoalData>;
export declare const getSavingsGoals: (userId: string) => Promise<SavingsGoalData[]>;
export declare const getSavingsGoalById: (goalId: string, userId: string) => Promise<SavingsGoalData>;
export declare const updateSavingsGoal: (goalId: string, userId: string, body: UpdateSavingsGoalBody) => Promise<SavingsGoalData>;
export declare const deleteSavingsGoal: (goalId: string, userId: string) => Promise<void>;
export declare const contribute: (goalId: string, userId: string, body: ContributeBody) => Promise<SavingsGoalData>;
export declare const getSavingsSummary: (userId: string) => Promise<SavingsSummary>;
//# sourceMappingURL=savings.service.d.ts.map