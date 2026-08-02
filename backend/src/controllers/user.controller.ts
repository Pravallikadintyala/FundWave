/**
 * User profile controller — thin HTTP layer over the user service.
 *
 * Per CLAUDE.md: controllers only validate requests and call services.
 * All business logic lives in src/services/user.service.ts.
 *
 * Both handlers require the `protect` middleware to run first,
 * which guarantees req.user is populated with a valid JwtPayload.
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { getUserProfile, updateUserProfile } from '../services/user.service';
import { AuthenticatedRequest } from '../types/auth.types';
import { UpdateProfileBody } from '../types/user.types';

/**
 * GET /api/users/me
 * Returns the authenticated user's full profile.
 */
export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // protect middleware guarantees req.user is set
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const profile = await getUserProfile(req.user.id);
    sendSuccess(res, { user: profile });
  },
);

/**
 * PUT /api/users/me
 * Updates editable profile fields for the authenticated user.
 */
export const updateMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = req.body as UpdateProfileBody;
    const profile = await updateUserProfile(req.user.id, body);
    sendSuccess(res, { user: profile });
  },
);
