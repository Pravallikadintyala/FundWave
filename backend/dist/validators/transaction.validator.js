"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionQuery = exports.validateUpdateTransaction = exports.validateCreateTransaction = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const finance_types_1 = require("../types/finance.types");
const validateCreateTransaction = (req, _res, next) => {
    const { category, type, amount, transactionDate } = req.body;
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        return next(new AppError_1.AppError('Category is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!mongoose_1.Types.ObjectId.isValid(category)) {
        return next(new AppError_1.AppError('Category must be a valid ID', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!type || !finance_types_1.TRANSACTION_TYPES.includes(type)) {
        return next(new AppError_1.AppError(`Type must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (amount === undefined || amount === null) {
        return next(new AppError_1.AppError('Amount is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return next(new AppError_1.AppError('Amount must be a number greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!transactionDate || typeof transactionDate !== 'string' || transactionDate.trim().length === 0) {
        return next(new AppError_1.AppError('Transaction date is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const parsedDate = new Date(transactionDate);
    if (isNaN(parsedDate.getTime())) {
        return next(new AppError_1.AppError('Transaction date must be a valid date', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateCreateTransaction = validateCreateTransaction;
const validateUpdateTransaction = (req, _res, next) => {
    const { category, type, amount, transactionDate } = req.body;
    const hasUpdatableField = category !== undefined ||
        type !== undefined ||
        amount !== undefined ||
        transactionDate !== undefined ||
        'description' in req.body;
    if (!hasUpdatableField) {
        return next(new AppError_1.AppError('At least one field is required (category, type, amount, description, transactionDate)', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (category !== undefined) {
        if (typeof category !== 'string' || !mongoose_1.Types.ObjectId.isValid(category)) {
            return next(new AppError_1.AppError('Category must be a valid ID', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (type !== undefined) {
        if (!finance_types_1.TRANSACTION_TYPES.includes(type)) {
            return next(new AppError_1.AppError(`Type must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (amount !== undefined) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return next(new AppError_1.AppError('Amount must be a number greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (transactionDate !== undefined) {
        const parsedDate = new Date(transactionDate);
        if (isNaN(parsedDate.getTime())) {
            return next(new AppError_1.AppError('Transaction date must be a valid date', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    next();
};
exports.validateUpdateTransaction = validateUpdateTransaction;
const validateTransactionQuery = (req, _res, next) => {
    const { type, category, startDate, endDate } = req.query;
    if (type !== undefined && !finance_types_1.TRANSACTION_TYPES.includes(type)) {
        return next(new AppError_1.AppError(`type query param must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (category !== undefined && !mongoose_1.Types.ObjectId.isValid(category)) {
        return next(new AppError_1.AppError('category query param must be a valid ID', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (startDate !== undefined) {
        const d = new Date(startDate);
        if (isNaN(d.getTime())) {
            return next(new AppError_1.AppError('startDate must be a valid date', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (endDate !== undefined) {
        const d = new Date(endDate);
        if (isNaN(d.getTime())) {
            return next(new AppError_1.AppError('endDate must be a valid date', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    next();
};
exports.validateTransactionQuery = validateTransactionQuery;
//# sourceMappingURL=transaction.validator.js.map