/**
 * Central route registry.
 * All API routes are mounted here and imported into app.ts.
 * Adding a new feature = adding one line here.
 */

import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import categoryRouter from './category.routes';
import transactionRouter from './transaction.routes';
import dashboardRouter from './dashboard.routes';
import savingsRouter from './savings.routes';
import aiRouter from './ai.routes';

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/transactions', transactionRouter);
router.use('/dashboard', dashboardRouter);
router.use('/savings-goals', savingsRouter);
router.use('/ai', aiRouter);

export default router;


