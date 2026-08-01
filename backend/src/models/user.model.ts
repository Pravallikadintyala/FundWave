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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
