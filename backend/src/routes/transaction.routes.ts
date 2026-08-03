/**
 * Transaction routes.
 *
 * Mounted at: /api/transactions  (registered in src/routes/index.ts)
 *
 * All routes are protected — valid JWT required.
 *
 * POST   /api/transactions        → createTransactionHandler (validated)
 * GET    /api/transactions        → getTransactionsHandler   (query validated)
 * GET    /api/transactions/:id    → getTransactionByIdHandler
 * PUT    /api/transactions/:id    → updateTransactionHandler (validated)
 * DELETE /api/transactions/:id    → deleteTransactionHandler
 */

import { Router } from 'express';
import {
  createTransactionHandler,
  getTransactionsHandler,
  getTransactionByIdHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
} from '../controllers/transaction.controller';
import { protect } from '../middleware/auth.middleware';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionQuery,
} from '../validators/transaction.validator';

const router: Router = Router();

// All transaction routes require authentication
router.use(protect);

router.post('/', validateCreateTransaction, createTransactionHandler);
router.get('/', validateTransactionQuery, getTransactionsHandler);
router.get('/:id', getTransactionByIdHandler);
router.put('/:id', validateUpdateTransaction, updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

export default router;
