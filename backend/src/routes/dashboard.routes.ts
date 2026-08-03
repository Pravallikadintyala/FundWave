/**
 * Dashboard routes.
 *
 * Mounted at: /api/dashboard  (registered in src/routes/index.ts)
 *
 * GET /api/dashboard → getDashboard (protected)
 */

import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = Router();

router.use(protect);

router.get('/', getDashboard);

export default router;
