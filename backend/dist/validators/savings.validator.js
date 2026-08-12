"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContribute = exports.validateUpdateSavingsGoal = exports.validateCreateSavingsGoal = void 0;
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const savings_types_1 = require("../types/savings.types");
const EDITABLE_FIELDS = ['title', 'targetAmount', 'targetDate', 'color', 'icon', 'status'];
const validateCreateSavingsGoal = (req, _res, next) => {
    const { title, targetAmount } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return next(new AppError_1.AppError('title is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (title.toString().trim().length > 100) {
        return next(new AppError_1.AppError('title must be at most 100 characters', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (targetAmount === undefined || targetAmount === null) {
        return next(new AppError_1.AppError('targetAmount is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const amount = Number(targetAmount);
    if (isNaN(amount) || amount <= 0) {
        return next(new AppError_1.AppError('targetAmount must be a number greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateCreateSavingsGoal = validateCreateSavingsGoal;
const validateUpdateSavingsGoal = (req, _res, next) => {
    const body = req.body;
    const unknown = Object.keys(body).filter((k) => !EDITABLE_FIELDS.includes(k));
    if (unknown.length > 0) {
        return next(new AppError_1.AppError(`Unknown field(s): ${unknown.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (Object.keys(body).length === 0) {
        return next(new AppError_1.AppError('At least one field is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const { title, targetAmount, status } = body;
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return next(new AppError_1.AppError('title must be a non-empty string', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
        if (title.trim().length > 100) {
            return next(new AppError_1.AppError('title must be at most 100 characters', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (targetAmount !== undefined) {
        const amount = Number(targetAmount);
        if (isNaN(amount) || amount <= 0) {
            return next(new AppError_1.AppError('targetAmount must be a number greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (status !== undefined && !savings_types_1.SAVINGS_GOAL_STATUSES.includes(status)) {
        return next(new AppError_1.AppError(`status must be one of: ${savings_types_1.SAVINGS_GOAL_STATUSES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateUpdateSavingsGoal = validateUpdateSavingsGoal;
const validateContribute = (req, _res, next) => {
    const { amount } = req.body;
    if (amount === undefined || amount === null) {
        return next(new AppError_1.AppError('amount is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
        return next(new AppError_1.AppError('amount must be a number greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateContribute = validateContribute;
//# sourceMappingURL=savings.validator.js.map