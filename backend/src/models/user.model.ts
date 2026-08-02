/**
 * User Mongoose model.
 *
 * Migrated from: backend/models/User.js
 *
 * Improvements over the JS version:
 *  - Typed with IUser interface via generics
 *  - Added timestamps for createdAt / updatedAt
 *  - password field has select: false so it is NEVER returned by default
 *    in any query (callers must explicitly opt-in with .select('+password'))
 */

import { Schema, model, Model } from 'mongoose';
import { IUser } from '../types/auth.types';
import { SUPPORTED_CURRENCIES, SUPPORTED_TIMEZONES } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // never returned in queries unless explicitly requested
    },
    // ─── Profile fields ────────────────────────────────────────────────────
    fullName: {
      type: String,
      trim: true,
      maxlength: [80, 'Full name must be at most 80 characters'],
    },
    avatar: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      enum: {
        values: SUPPORTED_CURRENCIES,
        message: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`,
      },
      default: 'INR',
    },
    timezone: {
      type: String,
      enum: {
        values: SUPPORTED_TIMEZONES,
        message: `Timezone must be one of: ${SUPPORTED_TIMEZONES.join(', ')}`,
      },
      default: 'Asia/Kolkata',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
