/**
 * Category service — all category business logic lives here.
 *
 * Zero Express knowledge (no req/res/next).
 * Called by the category controller only.
 *
 * Rules enforced here:
 *  - Default categories cannot be deleted.
 *  - Category names must be unique per user + type.
 *  - Users can only access their own categories.
 */

import { Types } from 'mongoose';
import { Category } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import {
  ICategory,
  CategoryData,
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/finance.types';

// ─── Private helper ───────────────────────────────────────────────────────────

const toCategoryData = (cat: ICategory): CategoryData => ({
  id: cat._id.toString(),
  user: cat.user.toString(),
  name: cat.name,
  type: cat.type,
  icon: cat.icon,
  color: cat.color,
  isDefault: cat.isDefault,
  createdAt: cat.createdAt,
  updatedAt: cat.updatedAt,
});

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * Seed default categories for a newly registered user.
 * Called from auth.service after successful user creation.
 * Uses insertMany for efficiency; ignores duplicates gracefully.
 */
export const seedDefaultCategories = async (userId: string): Promise<void> => {
  const userObjectId = new Types.ObjectId(userId);

  const docs = DEFAULT_CATEGORIES.map((cat) => ({
    user: userObjectId,
    name: cat.name,
    type: cat.type,
    icon: cat.icon,
    color: cat.color,
    isDefault: true,
  }));

  // ordered: false — continue inserting even if some docs cause duplicate errors
  await Category.insertMany(docs, { ordered: false }).catch(() => {
    // Silently swallow duplicate key errors on re-seed attempts
  });
};

/**
 * Create a custom category for the authenticated user.
 * Throws 409 if a category with the same name+type already exists.
 */
export const createCategory = async (
  userId: string,
  body: CreateCategoryBody,
): Promise<CategoryData> => {
  const existing = await Category.findOne({
    user: userId,
    name: body.name.trim(),
    type: body.type,
  });

  if (existing) {
    throw new AppError(
      `A ${body.type} category named "${body.name}" already exists`,
      HTTP_STATUS.CONFLICT,
    );
  }

  const category = await Category.create({
    user: userId,
    name: body.name.trim(),
    type: body.type,
    icon: body.icon?.trim(),
    color: body.color?.trim(),
    isDefault: false,
  });

  return toCategoryData(category);
};

/**
 * Get all categories belonging to the authenticated user.
 */
export const getCategories = async (userId: string): Promise<CategoryData[]> => {
  const categories = await Category.find({ user: userId }).sort({ type: 1, name: 1 });
  return categories.map(toCategoryData);
};

/**
 * Update a custom category owned by the authenticated user.
 * Name and icon/color may be updated; type cannot be changed.
 * Throws 404 if not found, 403 if default, 409 on name conflict.
 */
export const updateCategory = async (
  userId: string,
  categoryId: string,
  body: UpdateCategoryBody,
): Promise<CategoryData> => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  if (category.isDefault) {
    throw new AppError('Default categories cannot be modified', HTTP_STATUS.FORBIDDEN);
  }

  // Check name uniqueness if name is being updated
  if (body.name && body.name.trim() !== category.name) {
    const conflict = await Category.findOne({
      user: userId,
      name: body.name.trim(),
      type: category.type,
      _id: { $ne: categoryId },
    });

    if (conflict) {
      throw new AppError(
        `A ${category.type} category named "${body.name}" already exists`,
        HTTP_STATUS.CONFLICT,
      );
    }
  }

  if (body.name !== undefined) category.name = body.name.trim();
  if (body.icon !== undefined) category.icon = body.icon.trim();
  if (body.color !== undefined) category.color = body.color.trim();

  await category.save();
  return toCategoryData(category);
};

/**
 * Delete a custom category owned by the authenticated user.
 * Throws 404 if not found, 403 if it's a default category.
 */
export const deleteCategory = async (userId: string, categoryId: string): Promise<void> => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  if (category.isDefault) {
    throw new AppError('Default categories cannot be deleted', HTTP_STATUS.FORBIDDEN);
  }

  await category.deleteOne();
};
