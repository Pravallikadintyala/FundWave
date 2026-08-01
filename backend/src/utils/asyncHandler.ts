/**
 * asyncHandler — wraps async route handlers to forward errors to Express.
 *
 * Without this, an unhandled promise rejection inside a route handler
 * would crash Node without going through the centralized error middleware.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler =
  (fn: AsyncRouteHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
