/**
 * Central route registry.
 * All API routes are mounted here and imported into app.ts.
 * Adding a new feature = adding one line here.
 */

import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);

// Future routes will be registered here, e.g.:
// router.use('/transactions', transactionRouter);

export default router;

