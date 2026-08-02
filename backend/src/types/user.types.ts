/**
 * User profile-specific TypeScript interfaces.
 *
 * Separate from auth.types.ts to keep each concern self-contained.
 * Auth types own identity/JWT shapes; these types own profile CRUD shapes.
 */

// ─── Editable fields whitelist ────────────────────────────────────────────────

/** Fields a user is ALLOWED to update. */
export const EDITABLE_USER_FIELDS = ['fullName', 'avatar', 'currency', 'timezone'] as const;

export type EditableUserField = (typeof EDITABLE_USER_FIELDS)[number];

// ─── Allowed enum values ──────────────────────────────────────────────────────

/** ISO 4217 currency codes supported by FundWave. */
export const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD', 'JPY', 'CHF',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/** IANA timezone identifiers supported by FundWave. */
export const SUPPORTED_TIMEZONES = [
  'Asia/Kolkata',
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const;

export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];

// ─── Request body ─────────────────────────────────────────────────────────────

/** PUT /api/users/me body — all fields optional, at least one required. */
export interface UpdateProfileBody {
  fullName?: string;
  avatar?: string;
  currency?: SupportedCurrency;
  timezone?: SupportedTimezone;
}

// ─── Response shape ───────────────────────────────────────────────────────────

/** Full user profile returned from GET /api/users/me and PUT /api/users/me */
export interface UserProfileData {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  currency: string;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}
