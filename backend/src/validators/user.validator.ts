/**
 * User profile request validators.
 *
 * Runs as Express middleware before the controller is reached.
 * Validates PUT /api/users/me body:
 *   - Rejects unknown fields (prevents mass-assignment)
 *   - Validates individual field formats
 *   - Ensures at least one editable field is provided
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  EDITABLE_USER_FIELDS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
  UpdateProfileBody,
} from '../types/user.types';

const MAX_FULL_NAME_LENGTH = 80;
const AVATAR_URL_PATTERN = /^https?:\/\/.+/i;

/**
 * Validates PUT /api/users/me
 *
 * Rules:
 *  - Body must be a non-empty object
 *  - No unknown fields accepted (prevents mass-assignment attacks)
 *  - At least one editable field must be present
 *  - fullName: string, 1–80 chars
 *  - avatar: optional; if provided, must be a valid http(s) URL
 *  - currency: must be one of SUPPORTED_CURRENCIES
 *  - timezone: must be one of SUPPORTED_TIMEZONES
 */
export const validateUpdateProfile = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new AppError('Request body must be a JSON object', HTTP_STATUS.BAD_REQUEST));
  }

  // ── Reject unknown fields ───────────────────────────────────────────────────
  const unknownFields = Object.keys(body).filter(
    (key) => !EDITABLE_USER_FIELDS.includes(key as (typeof EDITABLE_USER_FIELDS)[number]),
  );
  if (unknownFields.length > 0) {
    return next(
      new AppError(
        `Unknown field(s): ${unknownFields.join(', ')}. Only the following fields can be updated: ${EDITABLE_USER_FIELDS.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  // ── At least one editable field required ────────────────────────────────────
  const provided = EDITABLE_USER_FIELDS.filter((f) => f in body);
  if (provided.length === 0) {
    return next(
      new AppError(
        `At least one of the following fields is required: ${EDITABLE_USER_FIELDS.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  const { fullName, avatar, currency, timezone } = body as UpdateProfileBody;

  // ── fullName ─────────────────────────────────────────────────────────────────
  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      return next(new AppError('fullName must be a non-empty string', HTTP_STATUS.BAD_REQUEST));
    }
    if (fullName.trim().length > MAX_FULL_NAME_LENGTH) {
      return next(
        new AppError(
          `fullName must be at most ${MAX_FULL_NAME_LENGTH} characters`,
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }
  }

  // ── avatar ───────────────────────────────────────────────────────────────────
  if (avatar !== undefined) {
    if (typeof avatar !== 'string') {
      return next(new AppError('avatar must be a string URL', HTTP_STATUS.BAD_REQUEST));
    }
    // Allow empty string to clear the avatar
    if (avatar.length > 0 && !AVATAR_URL_PATTERN.test(avatar)) {
      return next(
        new AppError('avatar must be a valid http or https URL', HTTP_STATUS.BAD_REQUEST),
      );
    }
  }

  // ── currency ─────────────────────────────────────────────────────────────────
  if (currency !== undefined) {
    if (!SUPPORTED_CURRENCIES.includes(currency as (typeof SUPPORTED_CURRENCIES)[number])) {
      return next(
        new AppError(
          `currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`,
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }
  }

  // ── timezone ─────────────────────────────────────────────────────────────────
  if (timezone !== undefined) {
    if (!SUPPORTED_TIMEZONES.includes(timezone as (typeof SUPPORTED_TIMEZONES)[number])) {
      return next(
        new AppError(
          `timezone must be one of: ${SUPPORTED_TIMEZONES.join(', ')}`,
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }
  }

  next();
};
