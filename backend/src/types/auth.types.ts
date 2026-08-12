/**
 * Auth-specific TypeScript interfaces and types.
 *
 * Centralised here so the User model, auth service, middleware,
 * and controllers all share the exact same contracts.
 */

import { Request } from 'express';
import { Types } from 'mongoose';

// ─── JWT ──────────────────────────────────────────────────────────────────────

/** Shape of the payload encoded inside the JWT. */
export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ─── Request bodies ───────────────────────────────────────────────────────────

/** POST /api/auth/signup */
export interface SignupBody {
  fullName: string;
  email: string;
  password: string;
}

/** POST /api/auth/login */
export interface LoginBody {
  email: string;
  password: string;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

/** Public user object — password is never included. */
export interface PublicUser {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  currency: string;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Payload returned on successful login. */
export interface LoginResponseData {
  token: string;
  user: PublicUser;
}

/** Payload returned on successful signup. */
export interface SignupResponseData {
  user: PublicUser;
}

// ─── Extended Request ─────────────────────────────────────────────────────────

/**
 * Express Request extended with the decoded JWT payload.
 * Populated by `authMiddleware` on protected routes.
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── Mongoose document ────────────────────────────────────────────────────────

/** Shape of a User document stored in MongoDB. */
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  authProvider: 'local' | 'google';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  // ─── Profile fields ──────────────────────────────
  fullName?: string;
  avatar?: string;
  currency: string;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Shape of a BlacklistedToken document. */
export interface IBlacklistedToken {
  _id: Types.ObjectId;
  token: string;
  createdAt: Date;
}
