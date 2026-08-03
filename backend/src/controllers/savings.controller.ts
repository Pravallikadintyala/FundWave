/**
 * Savings Goals controller — thin HTTP layer over savings.service.
 * Per CLAUDE.md: controllers only call services and return responses.
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  CreateSavingsGoalBody,
  UpdateSavingsGoalBody,
  ContributeBody,
} from '../types/savings.types';
import {
  createSavingsGoal,
  getSavingsGoals,
  getSavingsGoalById,
  updateSavingsGoal,
  deleteSavingsGoal,
  contribute,
} from '../services/savings.service';

const requireUser = (req: AuthenticatedRequest): string => {
  if (!req.user?.id) throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
  return req.user.id;
};

export const createGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = await createSavingsGoal(requireUser(req), req.body as CreateSavingsGoalBody);
    sendSuccess(res, { goal: data }, HTTP_STATUS.CREATED);
  },
);

export const getGoals = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = await getSavingsGoals(requireUser(req));
    sendSuccess(res, { goals: data });
  },
);

export const getGoalById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = await getSavingsGoalById(req.params.id, requireUser(req));
    sendSuccess(res, { goal: data });
  },
);

export const updateGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = await updateSavingsGoal(req.params.id, requireUser(req), req.body as UpdateSavingsGoalBody);
    sendSuccess(res, { goal: data });
  },
);

export const deleteGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await deleteSavingsGoal(req.params.id, requireUser(req));
    sendSuccess(res, { message: 'Savings goal deleted successfully' });
  },
);

export const contributeToGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = await contribute(req.params.id, requireUser(req), req.body as ContributeBody);
    sendSuccess(res, { goal: data });
  },
);
