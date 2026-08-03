/**
 * Savings Goals routes.
 *
 * Mounted at: /api/savings-goals  (registered in src/routes/index.ts)
 * All routes protected via router.use(protect).
 *
 * POST   /api/savings-goals
 * GET    /api/savings-goals
 * GET    /api/savings-goals/:id
 * PUT    /api/savings-goals/:id
 * DELETE /api/savings-goals/:id
 * POST   /api/savings-goals/:id/contribute
 */

import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  validateCreateSavingsGoal,
  validateUpdateSavingsGoal,
  validateContribute,
} from '../validators/savings.validator';
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  contributeToGoal,
} from '../controllers/savings.controller';

const router: Router = Router();

router.use(protect);

router.post('/', validateCreateSavingsGoal, createGoal);
router.get('/', getGoals);
router.get('/:id', getGoalById);
router.put('/:id', validateUpdateSavingsGoal, updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/contribute', validateContribute, contributeToGoal);

export default router;
