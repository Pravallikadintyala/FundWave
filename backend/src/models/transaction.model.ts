/**
 * Transaction Mongoose model.
 *
 * Each transaction belongs to a user and a category.
 * Amount must be positive and type must match the category type
 * (enforced at service layer).
 */

import { Schema, model, Model } from 'mongoose';
import { ITransaction, TRANSACTION_TYPES } from '../types/finance.types';

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      enum: {
        values: TRANSACTION_TYPES,
        message: `Type must be one of: ${TRANSACTION_TYPES.join(', ')}`,
      },
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound index for efficient per-user listing and date range filtering
transactionSchema.index({ user: 1, transactionDate: -1 });

const Transaction: Model<ITransaction> = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
