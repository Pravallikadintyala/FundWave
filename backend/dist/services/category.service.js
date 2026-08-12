"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = exports.seedDefaultCategories = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const defaultCategories_1 = require("../constants/defaultCategories");
const toCategoryData = (cat) => ({
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
const seedDefaultCategories = async (userId) => {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const docs = defaultCategories_1.DEFAULT_CATEGORIES.map((cat) => ({
        user: userObjectId,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        isDefault: true,
    }));
    await models_1.Category.insertMany(docs, { ordered: false }).catch(() => {
    });
};
exports.seedDefaultCategories = seedDefaultCategories;
const createCategory = async (userId, body) => {
    const existing = await models_1.Category.findOne({
        user: userId,
        name: body.name.trim(),
        type: body.type,
    });
    if (existing) {
        throw new AppError_1.AppError(`A ${body.type} category named "${body.name}" already exists`, constants_1.HTTP_STATUS.CONFLICT);
    }
    const category = await models_1.Category.create({
        user: userId,
        name: body.name.trim(),
        type: body.type,
        icon: body.icon?.trim(),
        color: body.color?.trim(),
        isDefault: false,
    });
    return toCategoryData(category);
};
exports.createCategory = createCategory;
const getCategories = async (userId) => {
    const categories = await models_1.Category.find({ user: userId }).sort({ type: 1, name: 1 });
    return categories.map(toCategoryData);
};
exports.getCategories = getCategories;
const updateCategory = async (userId, categoryId, body) => {
    const category = await models_1.Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
        throw new AppError_1.AppError('Category not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    if (category.isDefault) {
        throw new AppError_1.AppError('Default categories cannot be modified', constants_1.HTTP_STATUS.FORBIDDEN);
    }
    if (body.name && body.name.trim() !== category.name) {
        const conflict = await models_1.Category.findOne({
            user: userId,
            name: body.name.trim(),
            type: category.type,
            _id: { $ne: categoryId },
        });
        if (conflict) {
            throw new AppError_1.AppError(`A ${category.type} category named "${body.name}" already exists`, constants_1.HTTP_STATUS.CONFLICT);
        }
    }
    if (body.name !== undefined)
        category.name = body.name.trim();
    if (body.icon !== undefined)
        category.icon = body.icon.trim();
    if (body.color !== undefined)
        category.color = body.color.trim();
    await category.save();
    return toCategoryData(category);
};
exports.updateCategory = updateCategory;
const deleteCategory = async (userId, categoryId) => {
    const category = await models_1.Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
        throw new AppError_1.AppError('Category not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    if (category.isDefault) {
        throw new AppError_1.AppError('Default categories cannot be deleted', constants_1.HTTP_STATUS.FORBIDDEN);
    }
    await category.deleteOne();
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.service.js.map