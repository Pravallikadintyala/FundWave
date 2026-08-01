/**
 * MongoDB connection utility using Mongoose.
 * Handles connection lifecycle and emits structured logs.
 */

import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ MongoDB connection failed: ${message}`);
    // Exit process so the orchestrator (PM2 / Docker) can restart
    process.exit(1);
  }
};
