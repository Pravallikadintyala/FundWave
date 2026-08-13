"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const savings_types_1 = require("../types/savings.types");
const savingsGoalSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title must be at most 100 characters'],
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [0.01, 'Target amount must be greater than zero'],
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative'],
    },
    targetDate: {
        type: Date,
    },
    color: {
        type: String,
        trim: true,
    },
    icon: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: savings_types_1.SAVINGS_GOAL_STATUSES,
            message: `Status must be one of: ${savings_types_1.SAVINGS_GOAL_STATUSES.join(', ')}`,
        },
        default: 'Active',
    },
}, {
    timestamps: true,
    versionKey: false,
});
const SavingsGoal = (0, mongoose_1.model)('SavingsGoal', savingsGoalSchema);
savingsGoalSchema.index({ user: 1, createdAt: -1 });
exports.default = SavingsGoal;
//# sourceMappingURL=savingsGoal.model.js.map