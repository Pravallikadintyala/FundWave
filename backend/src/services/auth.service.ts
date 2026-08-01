/**
 * Auth service — all authentication business logic lives here.
 *
 * Migrated from: backend/controllers/authController.js (business logic extracted)
 *
 * Controllers call these functions and map results to HTTP responses.
 * This layer has zero knowledge of Express (no req/res/next).
 *
 * Improvements over the original:
 *  - Business logic fully separated from HTTP layer
 *  - Password never returned from any method
 *  - Consistent use of AppError for all error cases
 *  - Typed parameters and return values
 *  - JWT generation isolated in a dedicated helper
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User, BlacklistedToken } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  SignupBody,
  LoginBody,
  SignupResponseData,
  LoginResponseData,
  JwtPayload,
} from '../types/auth.types';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '1h';

// ─── Private helpers ──────────────────────────────────────────────────────────

const signToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
};

const buildPublicUser = (id: string, username: string) => ({ id, username });

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Throws AppError (409) if the username is already taken.
 */
export const signupUser = async (body: SignupBody): Promise<SignupResponseData> => {
  const { username, password } = body;

  const existing = await User.findOne({ username: username.trim() });
  if (existing) {
    throw new AppError('Username is already taken', HTTP_STATUS.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    username: username.trim(),
    password: hashedPassword,
  });

  return {
    user: buildPublicUser(newUser._id.toString(), newUser.username),
  };
};

/**
 * Authenticate a user and return a signed JWT.
 * Throws AppError (401) with a generic message for both "not found" and
 * "wrong password" to prevent username enumeration attacks.
 */
export const loginUser = async (body: LoginBody): Promise<LoginResponseData> => {
  const { username, password } = body;

  // select: false on the schema means we must opt-in here
  const user = await User.findOne({ username: username.trim() }).select('+password');

  if (!user) {
    throw new AppError('Invalid username or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid username or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = signToken({ id: user._id.toString(), username: user.username });

  return {
    token,
    user: buildPublicUser(user._id.toString(), user.username),
  };
};

/**
 * Invalidate a JWT by storing it in the blacklist collection.
 * The TTL index on the collection auto-purges expired entries.
 */
export const logoutUser = async (token: string): Promise<void> => {
  await BlacklistedToken.create({ token });
};
