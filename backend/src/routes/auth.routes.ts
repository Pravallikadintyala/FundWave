/**
 * Auth routes.
 */

import { Router } from 'express';
import { 
  signup, 
  login, 
  logout, 
  getProfile,
  googleAuth,
  googleCallback,
  requestPasswordReset,
  confirmPasswordReset
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateSignup, validateLogin } from '../validators/auth.validator';

const router: Router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', confirmPasswordReset);

// ─── Protected ────────────────────────────────────────────────────────────────
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

export default router;
