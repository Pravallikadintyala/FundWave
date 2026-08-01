/**
 * server.ts — HTTP server entry point.
 *
 * Responsibilities:
 *   - Connect to the database
 *   - Create the Express app
 *   - Start the HTTP server
 *   - Handle graceful shutdown on SIGTERM / SIGINT
 *
 * This file is the ONLY file that calls app.listen().
 */

import { config } from './config/env';
import { connectDB } from './config/database';
import createApp from './app';

const startServer = async (): Promise<void> => {
  // Establish DB connection before accepting traffic
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(
      `🚀 FundWave API running on http://localhost:${config.port} [${config.nodeEnv}]`,
    );
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal: string): void => {
    console.log(`\n📴 ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });

    // Force-kill if server hasn't closed within 10s
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ─── Unhandled Rejections / Exceptions ────────────────────────────────────
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('🔥 Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('🔥 Uncaught Exception:', error.message);
    process.exit(1);
  });
};

startServer().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
