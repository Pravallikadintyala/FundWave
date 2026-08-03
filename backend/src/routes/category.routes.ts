/**
 * Category routes.
 *
 * Mounted at: /api/categories  (registered in src/routes/index.ts)
 *
 * All routes are protected — valid JWT required.
 *
 * POST   /api/categories        → createCategoryHandler (validated)
 * GET    /api/categories        → getCategoriesHandler
 * PUT    /api/categories/:id    → updateCategoryHandler (validated)
 * DELETE /api/categories/:id    → deleteCategoryHandler
 */

import { Router } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/category.controller';
import { protect } from '../middleware/auth.middleware';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../validators/category.validator';

const router: Router = Router();

// All category routes require authentication
router.use(protect);

router.post('/', validateCreateCategory, createCategoryHandler);
router.get('/', getCategoriesHandler);
router.put('/:id', validateUpdateCategory, updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

export default router;
