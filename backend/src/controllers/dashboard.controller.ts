/**
 * Dashboard controller — thin HTTP layer over the dashboard service.
 *
 * Per CLAUDE.md: controllers only validate requests and call services.
 * All business logic lives in src/services/dashboard.service.ts.
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { getDashboardData } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../types/auth.types';

/**
 * GET /api/dashboard
 * Returns aggregated analytics for the authenticated user.
 */
export const getDashboard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const data = await getDashboardData(req.user.id);
    sendSuccess(res, data);
  },
);
