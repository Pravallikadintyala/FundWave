/**
 * Category Mongoose model.
 *
 * Each category belongs to a user and has a type (Income | Expense).
 * Default categories (isDefault: true) are seeded on user creation and
 * cannot be deleted.
 * Category names must be unique per user + type combination.
 */

import { Schema, model, Model } from 'mongoose';
import { ICategory, TRANSACTION_TYPES } from '../types/finance.types';

const categorySchema = new Schema<ICategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name must be at most 50 characters'],
    },
    type: {
      type: String,
      enum: {
        values: TRANSACTION_TYPES,
        message: `Type must be one of: ${TRANSACTION_TYPES.join(', ')}`,
      },
      required: [true, 'Category type is required'],
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Unique compound index: a user cannot have two categories with the same name+type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category: Model<ICategory> = model<ICategory>('Category', categorySchema);

export default Category;
