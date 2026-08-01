/**
 * app.ts — Express application factory.
 *
 * Responsibilities:
 *   - Register security middleware (Helmet, CORS, Compression)
 *   - Configure request parsing
 *   - Attach HTTP request logger (Morgan)
 *   - Mount API routes
 *   - Register 404 and global error handlers
 *
 * Intentionally has NO knowledge of the HTTP server (port / listen).
 * That responsibility belongs exclusively to server.ts, which also
 * makes this module straightforward to import in integration tests.
 */

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env';
import apiRouter from './routes';
import { notFoundHandler, errorHandler } from './middleware';

const createApp = (): Application => {
  const app: Application = express();

  // ─── Security ─────────────────────────────────────────────────────────────
  // Helmet sets various HTTP headers to protect against well-known web exploits
  app.use(helmet());

  // CORS — restrict origins in production via env variable
  app.use(
    cors({
      origin: config.isDevelopment ? '*' : process.env.ALLOWED_ORIGINS?.split(',') ?? [],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // Gzip responses to reduce payload size
  app.use(compression());

  // ─── Request Logging ───────────────────────────────────────────────────────
  // 'dev' format in development (colorised), 'combined' in production (Apache-style)
  app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

  // ─── Body Parsing ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ─── Routes ────────────────────────────────────────────────────────────────
  app.use('/api', apiRouter);

  // ─── Error Handling ────────────────────────────────────────────────────────
  // 404 must come AFTER all routes
  app.use(notFoundHandler);
  // Global error handler must be the LAST middleware (4-arg signature)
  app.use(errorHandler);

  return app;
};

export default createApp;
