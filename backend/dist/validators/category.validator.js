"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCategory = exports.validateCreateCategory = void 0;
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const finance_types_1 = require("../types/finance.types");
const validateCreateCategory = (req, _res, next) => {
    const { name, type } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return next(new AppError_1.AppError('Category name is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (name.trim().length > 50) {
        return next(new AppError_1.AppError('Category name must be at most 50 characters', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!type || !finance_types_1.TRANSACTION_TYPES.includes(type)) {
        return next(new AppError_1.AppError(`Type must be one of: ${finance_types_1.TRANSACTION_TYPES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateCreateCategory = validateCreateCategory;
const validateUpdateCategory = (req, _res, next) => {
    const { name, icon, color } = req.body;
    const hasUpdatableField = name !== undefined || icon !== undefined || color !== undefined;
    if (!hasUpdatableField) {
        return next(new AppError_1.AppError('At least one updatable field is required (name, icon, color)', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return next(new AppError_1.AppError('Category name must be a non-empty string', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
        if (name.trim().length > 50) {
            return next(new AppError_1.AppError('Category name must be at most 50 characters', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    next();
};
exports.validateUpdateCategory = validateUpdateCategory;
//# sourceMappingURL=category.validator.js.map