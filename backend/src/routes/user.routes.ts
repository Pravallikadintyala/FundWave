/**
 * User profile routes.
 *
 * Mounted at: /api/users  (registered in src/routes/index.ts)
 *
 * All routes are protected — valid JWT required.
 *
 * GET  /api/users/me   → getMe
 * PUT  /api/users/me   → updateMe (validated before handler)
 */

import { Router } from 'express';
import { getMe, updateMe } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { validateUpdateProfile } from '../validators/user.validator';

const router: Router = Router();

// All user profile routes require authentication
router.use(protect);

router.get('/me', getMe);
router.put('/me', validateUpdateProfile, updateMe);

export default router;
