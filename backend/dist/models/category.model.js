"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const finance_types_1 = require("../types/finance.types");
const categorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            values: finance_types_1.TRANSACTION_TYPES,
            message: `Type must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`,
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
}, {
    timestamps: true,
    versionKey: false,
});
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=category.model.js.map