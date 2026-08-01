/**
 * Auth routes.
 *
 * Migrated from: backend/routes/authRoutes.js
 *
 * Mounted at: /api/auth  (registered in src/routes/index.ts)
 *
 * Public routes:
 *   POST /api/auth/signup
 *   POST /api/auth/login
 *
 * Protected routes (require valid Bearer JWT):
 *   GET  /api/auth/profile
 *   POST /api/auth/logout
 */

import { Router } from 'express';
import { signup, login, logout, getProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateSignup, validateLogin } from '../validators/auth.validator';

const router: Router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// ─── Protected ────────────────────────────────────────────────────────────────
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

export default router;
