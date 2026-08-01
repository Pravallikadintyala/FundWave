/**
 * BlacklistedToken Mongoose model.
 *
 * Migrated from: backend/models/BlacklistedToken.js
 *
 * Stores JWT tokens that have been explicitly logged out.
 * The TTL index auto-deletes documents after 1 hour, matching
 * the JWT expiry so the collection stays lean.
 */

import { Schema, model, Model } from 'mongoose';
import { IBlacklistedToken } from '../types/auth.types';

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // MongoDB TTL index — auto-delete after 1 hour (matches JWT expiry)
    },
  },
  {
    versionKey: false,
  },
);

const BlacklistedToken: Model<IBlacklistedToken> = model<IBlacklistedToken>(
  'BlacklistedToken',
  blacklistedTokenSchema,
);

export default BlacklistedToken;
