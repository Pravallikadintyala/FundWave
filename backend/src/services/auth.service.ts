/**
 * Auth service — all authentication business logic lives here.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env';
import { User, BlacklistedToken } from '../models';
import { AppError } from '../utils/AppError';
import { seedDefaultCategories } from './category.service';
import { sendPasswordResetEmail } from './email/email.service';
import { HTTP_STATUS } from '../constants';
import {
  SignupBody,
  LoginBody,
  SignupResponseData,
  LoginResponseData,
  JwtPayload,
  IUser,
} from '../types/auth.types';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '7d';

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  config.googleCallbackUrl
);

// ─── Private helpers ──────────────────────────────────────────────────────────

const signToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
};

const buildPublicUser = (user: IUser) => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  currency: user.currency,
  timezone: user.timezone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─── Service methods ──────────────────────────────────────────────────────────

export const signupUser = async (body: SignupBody): Promise<SignupResponseData> => {
  const { email, password, fullName } = body;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new AppError('Email is already registered', HTTP_STATUS.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    email: normalizedEmail,
    fullName: fullName.trim(),
    password: hashedPassword,
    authProvider: 'local',
  });

  await seedDefaultCategories(newUser._id.toString());

  return {
    user: buildPublicUser(newUser),
  };
};

export const loginUser = async (body: LoginBody): Promise<LoginResponseData> => {
  const { email, password } = body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || user.authProvider !== 'local') {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = signToken({ id: user._id.toString(), email: user.email });

  return {
    token,
    user: buildPublicUser(user),
  };
};

export const logoutUser = async (token: string): Promise<void> => {
  await BlacklistedToken.create({ token });
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export const getGoogleAuthUrl = (): string => {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent'
  });
};

export const handleGoogleCallback = async (code: string): Promise<LoginResponseData> => {
  const { tokens } = await googleClient.getToken(code);
  googleClient.setCredentials(tokens);

  // Get user info
  const response = await googleClient.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' });
  const data = response.data as { email: string, name: string, picture: string, email_verified: boolean };

  if (!data.email_verified) {
    throw new AppError('Google email is not verified', HTTP_STATUS.BAD_REQUEST);
  }

  const normalizedEmail = data.email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    // If user exists but is local, we could link accounts or block. We will just update authProvider or login
    if (user.authProvider !== 'google') {
      user.authProvider = 'google';
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      email: normalizedEmail,
      fullName: data.name,
      avatar: data.picture,
      authProvider: 'google',
    });
    await seedDefaultCategories(user._id.toString());
  }

  const token = signToken({ id: user._id.toString(), email: user.email });

  return {
    token,
    user: buildPublicUser(user),
  };
};

// ─── Password Reset ───────────────────────────────────────────────────────────

export const forgotPassword = async (email: string): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail, authProvider: 'local' });

  if (!user) {
    // Return successfully anyway to prevent email enumeration
    return;
  }

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expires in 15 minutes
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); 
  await user.save();

  await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', HTTP_STATUS.BAD_REQUEST);
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};
