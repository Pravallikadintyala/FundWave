/**
 * Health controller.
 * Responds to GET /api/health with the canonical CLAUDE.md success envelope.
 */

import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const getHealth = (_req: Request, res: Response): void => {
  sendSuccess(res, { status: 'OK' });
};
