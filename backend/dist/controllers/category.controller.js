"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.getCategoriesHandler = exports.createCategoryHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const category_service_1 = require("../services/category.service");
exports.createCategoryHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const body = req.body;
    const category = await (0, category_service_1.createCategory)(req.user.id, body);
    (0, response_1.sendSuccess)(res, { category }, constants_1.HTTP_STATUS.CREATED);
});
exports.getCategoriesHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const categories = await (0, category_service_1.getCategories)(req.user.id);
    (0, response_1.sendSuccess)(res, { categories });
});
exports.updateCategoryHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const body = req.body;
    const category = await (0, category_service_1.updateCategory)(req.user.id, req.params.id, body);
    (0, response_1.sendSuccess)(res, { category });
});
exports.deleteCategoryHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    await (0, category_service_1.deleteCategory)(req.user.id, req.params.id);
    (0, response_1.sendSuccess)(res, { message: 'Category deleted successfully' });
});
//# sourceMappingURL=category.controller.js.map