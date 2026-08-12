/**
 * Authentication middleware — protects routes behind JWT verification.
 *
 * Migrated from: backend/middleware/authMiddleware.js
 *
 * Improvements over the original:
 *  - Fully typed (no `any`, no `req.user` mutation without a proper interface)
 *  - Uses AppError so all errors flow through the centralized error handler
 *  - Typed JWT payload verification with a type guard
 *  - Proper extraction with null-safety on the Authorization header
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { BlacklistedToken } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest, JwtPayload } from '../types/auth.types';

/** Type guard — confirms the decoded JWT has the expected shape. */
const isJwtPayload = (value: unknown): value is JwtPayload => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as JwtPayload).id === 'string' &&
    typeof (value as JwtPayload).email === 'string'
  );
};

/**
 * `protect` — Express middleware that validates the Bearer token,
 * checks the blacklist, and attaches the decoded payload to `req.user`.
 *
 * Usage: router.get('/protected', protect, handler)
 */
export const protect = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    // Check blacklist before verifying signature to avoid unnecessary crypto work
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      throw new AppError(
        'Token has been revoked. Please log in again.',
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    if (!isJwtPayload(decoded)) {
      throw new AppError('Invalid token payload', HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = decoded;
    next();
  },
);
