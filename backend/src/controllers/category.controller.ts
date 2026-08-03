/**
 * Category controller — thin HTTP layer over the category service.
 *
 * Per CLAUDE.md: controllers only validate requests and call services.
 * All business logic lives in src/services/category.service.ts.
 *
 * All routes require the `protect` middleware (set at router level).
 */

import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../services/category.service';
import { AuthenticatedRequest } from '../types/auth.types';
import { CreateCategoryBody, UpdateCategoryBody } from '../types/finance.types';

/**
 * POST /api/categories
 * Creates a custom category for the authenticated user.
 */
export const createCategoryHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = req.body as CreateCategoryBody;
    const category = await createCategory(req.user.id, body);
    sendSuccess(res, { category }, HTTP_STATUS.CREATED);
  },
);

/**
 * GET /api/categories
 * Returns all categories for the authenticated user.
 */
export const getCategoriesHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const categories = await getCategories(req.user.id);
    sendSuccess(res, { categories });
  },
);

/**
 * PUT /api/categories/:id
 * Updates a custom category owned by the authenticated user.
 */
export const updateCategoryHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const body = req.body as UpdateCategoryBody;
    const category = await updateCategory(req.user.id, req.params.id, body);
    sendSuccess(res, { category });
  },
);

/**
 * DELETE /api/categories/:id
 * Deletes a custom category owned by the authenticated user.
 * Default categories cannot be deleted.
 */
export const deleteCategoryHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    await deleteCategory(req.user.id, req.params.id);
    sendSuccess(res, { message: 'Category deleted successfully' });
  },
);
