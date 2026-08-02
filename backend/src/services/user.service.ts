/**
 * User profile service — business logic for profile read/update.
 *
 * Zero Express knowledge (no req/res/next).
 * Called by the user controller only.
 *
 * Security guarantees:
 *  - Only fields in EDITABLE_USER_FIELDS can be persisted
 *  - Password is never selected or returned
 *  - Operations are scoped to userId from the verified JWT
 */

import { User } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  UpdateProfileBody,
  UserProfileData,
  EDITABLE_USER_FIELDS,
} from '../types/user.types';

// ─── Private helper ───────────────────────────────────────────────────────────

/**
 * Map a Mongoose user document to the safe public profile shape.
 * Never includes password or internal Mongoose fields.
 */
const toProfileData = (user: {
  _id: { toString(): string };
  username: string;
  fullName?: string;
  avatar?: string;
  currency: string;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}): UserProfileData => ({
  id: user._id.toString(),
  username: user.username,
  fullName: user.fullName,
  avatar: user.avatar,
  currency: user.currency,
  timezone: user.timezone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile by their MongoDB ID.
 * Throws 404 if the user no longer exists (e.g. deleted after login).
 */
export const getUserProfile = async (userId: string): Promise<UserProfileData> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return toProfileData(user);
};

/**
 * Update the authenticated user's editable profile fields.
 *
 * Only fields that are in EDITABLE_USER_FIELDS are applied —
 * the allowlist is enforced here in addition to the validator,
 * providing defence-in-depth against mass-assignment.
 *
 * Returns the updated profile data.
 */
export const updateUserProfile = async (
  userId: string,
  body: UpdateProfileBody,
): Promise<UserProfileData> => {
  // Build an update object containing only explicitly provided editable fields
  const updates: Partial<Record<(typeof EDITABLE_USER_FIELDS)[number], unknown>> = {};

  for (const field of EDITABLE_USER_FIELDS) {
    if (field in body) {
      // Normalise string fields
      const value = body[field];
      updates[field] = typeof value === 'string' ? value.trim() : value;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    {
      returnDocument: 'after', // return the updated document (replaces deprecated `new: true`)
      runValidators: true,     // enforce schema-level validation
    },
  );

  if (!updatedUser) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return toProfileData(updatedUser);
};
