/**
 * savingsGoalService — thin API layer over the savings-goals endpoints.
 *
 * Maps one-to-one to the existing backend routes:
 *   POST   /savings-goals              → createGoal
 *   GET    /savings-goals              → getGoals
 *   GET    /savings-goals/:id          → getGoalById
 *   PUT    /savings-goals/:id          → updateGoal
 *   DELETE /savings-goals/:id          → deleteGoal
 *   POST   /savings-goals/:id/contribute → contribute
 *
 * No business logic. No state. Called only by the useSavingsGoals hook.
 */

import { apiClient } from '@/api/axiosClient';
import type { ApiResponse, SavingsGoal, SavingsGoalStatus } from '@/types';

// ─── Payload shapes ────────────────────────────────────────────────────────────
// Mirror the backend CreateSavingsGoalBody / UpdateSavingsGoalBody / ContributeBody.

export interface CreateSavingsGoalPayload {
  title: string;
  targetAmount: number;
  targetDate?: string;   // ISO date string
  color?: string;
  icon?: string;
}

export interface UpdateSavingsGoalPayload {
  title?: string;
  targetAmount?: number;
  targetDate?: string;
  color?: string;
  icon?: string;
  status?: SavingsGoalStatus;
}

export interface ContributePayload {
  amount: number;
}

// ─── Response shapes ───────────────────────────────────────────────────────────

interface GoalsResponse {
  goals: SavingsGoal[];
}

interface GoalResponse {
  goal: SavingsGoal;
}

interface MessageResponse {
  message: string;
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const savingsGoalService = {
  /** GET /savings-goals — every goal for the authenticated user (newest first). */
  getGoals: () =>
    apiClient.get<ApiResponse<GoalsResponse>>('/savings-goals'),

  /** GET /savings-goals/:id — a single goal, freshest server state. */
  getGoalById: (id: string) =>
    apiClient.get<ApiResponse<GoalResponse>>(`/savings-goals/${id}`),

  /** POST /savings-goals — create a goal. */
  createGoal: (payload: CreateSavingsGoalPayload) =>
    apiClient.post<ApiResponse<GoalResponse>>('/savings-goals', payload),

  /** PUT /savings-goals/:id — partial update. */
  updateGoal: (id: string, payload: UpdateSavingsGoalPayload) =>
    apiClient.put<ApiResponse<GoalResponse>>(`/savings-goals/${id}`, payload),

  /** DELETE /savings-goals/:id — permanent delete. */
  deleteGoal: (id: string) =>
    apiClient.delete<ApiResponse<MessageResponse>>(`/savings-goals/${id}`),

  /** POST /savings-goals/:id/contribute — add money to a goal. */
  contribute: (id: string, payload: ContributePayload) =>
    apiClient.post<ApiResponse<GoalResponse>>(`/savings-goals/${id}/contribute`, payload),
};
