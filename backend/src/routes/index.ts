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

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/transactions', transactionRouter);

export default router;
