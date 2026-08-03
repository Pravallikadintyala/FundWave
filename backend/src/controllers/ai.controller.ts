/**
 * AI Insights controller — thin HTTP layer over ai.service.
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '../types/auth.types';
import { getAIInsights } from '../services/ai.service';

/**
 * GET /api/ai/insights
 * Generates and returns personalised AI financial insights for the authenticated user.
 */
export const getInsights = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const insights = await getAIInsights(req.user.id);
    sendSuccess(res, { insights });
  },
);
