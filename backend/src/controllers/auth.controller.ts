/**
 * Auth controller — thin HTTP layer over the auth service.
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { config } from '../config/env';
import { 
  signupUser, 
  loginUser, 
  logoutUser, 
  getGoogleAuthUrl, 
  handleGoogleCallback,
  forgotPassword,
  resetPassword
} from '../services/auth.service';
import { AuthenticatedRequest, SignupBody, LoginBody } from '../types/auth.types';
import { AppError } from '../utils/AppError';

export const signup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const body = req.body as SignupBody;
    const data = await signupUser(body);
    sendSuccess(res, data, HTTP_STATUS.CREATED);
  },
);

export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const body = req.body as LoginBody;
    const data = await loginUser(body);
    sendSuccess(res, data);
  },
);

export const logout = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    await logoutUser(token);
    sendSuccess(res, { message: 'Logged out successfully' });
  },
);

export const getProfile = (req: AuthenticatedRequest, res: Response): void => {
  sendSuccess(res, { user: req.user });
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export const googleAuth = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const url = getGoogleAuthUrl();
    // In some SPAs, you might return the URL. Here we will directly redirect.
    res.redirect(url);
  }
);

export const googleCallback = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;
    
    if (!code) {
      res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
      return;
    }

    try {
      const data = await handleGoogleCallback(code);
      // Redirect to frontend callback route with token
      res.redirect(`${config.frontendUrl}/auth/callback?token=${data.token}`);
    } catch (err) {
      // Log the full error so it is visible in the backend terminal
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[Google OAuth] Callback failed:', errMsg);
      if (err instanceof Error && err.stack) {
        console.error('[Google OAuth] Stack:', err.stack);
      }
      res.redirect(`${config.frontendUrl}/login?error=oauth_failed&reason=${encodeURIComponent(errMsg)}`);
    }
  }
);

// ─── Password Reset ───────────────────────────────────────────────────────────

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    
    if (!email) {
      throw new AppError('Email is required', HTTP_STATUS.BAD_REQUEST);
    }

    await forgotPassword(email);
    // Always return success even if email doesn't exist
    sendSuccess(res, { message: 'If an account with that email exists, we sent a password reset link.' });
  }
);

export const confirmPasswordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      throw new AppError('Token and new password are required', HTTP_STATUS.BAD_REQUEST);
    }

    await resetPassword(token, newPassword);
    sendSuccess(res, { message: 'Password has been reset successfully.' });
  }
);
