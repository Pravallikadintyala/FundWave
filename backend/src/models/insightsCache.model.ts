/**
 * InsightsCache Mongoose model.
 *
 * Stores the last Gemini-generated AI insights per user so they survive
 * server restarts. The TTL index on `expiresAt` lets MongoDB automatically
 * delete stale documents — no manual cleanup needed.
 */

import { Schema, model, Model, Types } from 'mongoose';

export interface IInsightsCache {
  user: Types.ObjectId;
  data: Record<string, unknown>;
  transactionCount: number;
  expiresAt: Date;
}

const insightsCacheSchema = new Schema<IInsightsCache>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cache entry per user
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    transactionCount: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index — auto-deletes expired docs
    },
  },
  { timestamps: false, versionKey: false },
);

const InsightsCache: Model<IInsightsCache> = model<IInsightsCache>(
  'InsightsCache',
  insightsCacheSchema,
);

export default InsightsCache;
