"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const finance_types_1 = require("../types/finance.types");
const transactionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    type: {
        type: String,
        enum: {
            values: finance_types_1.TRANSACTION_TYPES,
            message: `Type must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`,
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
}, {
    timestamps: true,
    versionKey: false,
});
transactionSchema.index({ user: 1, transactionDate: -1 });
const Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=transaction.model.js.map