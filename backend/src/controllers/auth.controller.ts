/**
 * Auth controller — thin HTTP layer over the auth service.
 *
 * Migrated from: backend/controllers/authController.js
 *
 * Per CLAUDE.md: controllers only validate requests and call services.
 * All business logic lives in src/services/auth.service.ts.
 *
 * Improvements over the original:
 *  - No inline business logic
 *  - asyncHandler eliminates try/catch boilerplate
 *  - sendSuccess / sendError enforce standardized response envelopes
 *  - Password field is NEVER referenced here (service handles that)
 *  - Typed request bodies
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { signupUser, loginUser, logoutUser } from '../services/auth.service';
import { AuthenticatedRequest, SignupBody, LoginBody } from '../types/auth.types';
import { AppError } from '../utils/AppError';

/**
 * POST /api/auth/signup
 * Public — no auth required.
 */
export const signup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const body = req.body as SignupBody;
    const data = await signupUser(body);
    sendSuccess(res, data, HTTP_STATUS.CREATED);
  },
);

/**
 * POST /api/auth/login
 * Public — no auth required.
 */
export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const body = req.body as LoginBody;
    const data = await loginUser(body);
    sendSuccess(res, data);
  },
);

/**
 * POST /api/auth/logout
 * Protected — requires valid Bearer token.
 */
export const logout = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    // Guard: protect middleware guarantees this header exists and is valid,
    // but we check defensively to satisfy TypeScript.
    if (!authHeader) {
      throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    await logoutUser(token);
    sendSuccess(res, { message: 'Logged out successfully' });
  },
);

/**
 * GET /api/auth/profile
 * Protected — returns the authenticated user's public profile.
 * No service call needed — payload is already on req.user from middleware.
 */
export const getProfile = (req: AuthenticatedRequest, res: Response): void => {
  sendSuccess(res, { user: req.user });
};
