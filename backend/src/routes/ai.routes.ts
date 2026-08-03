/**
 * AI routes.
 *
 * Mounted at: /api/ai  (registered in src/routes/index.ts)
 * All routes protected via router.use(protect).
 *
 * GET /api/ai/insights → getInsights
 */

import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getInsights } from '../controllers/ai.controller';

const router: Router = Router();

router.use(protect);

router.get('/insights', getInsights);

export default router;
