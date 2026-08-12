"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
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
const toTransactionData = (tx) => {
    const cat = tx.category;
    const categoryField = cat && typeof cat === 'object' && 'name' in cat
        ? toCategoryData(cat)
        : cat.toString();
    return {
        id: tx._id.toString(),
        user: tx.user.toString(),
        category: categoryField,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        transactionDate: tx.transactionDate,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
    };
};
const resolveCategory = async (userId, categoryId, transactionType) => {
    if (!mongoose_1.Types.ObjectId.isValid(categoryId)) {
        throw new AppError_1.AppError('Invalid category ID', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const category = await models_1.Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
        throw new AppError_1.AppError('Category not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    if (category.type !== transactionType) {
        throw new AppError_1.AppError(`Category type "${category.type}" does not match transaction type "${transactionType}"`, constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
    return category;
};
const createTransaction = async (userId, body) => {
    await resolveCategory(userId, body.category, body.type);
    const transaction = await models_1.Transaction.create({
        user: userId,
        category: body.category,
        type: body.type,
        amount: body.amount,
        description: body.description?.trim(),
        transactionDate: new Date(body.transactionDate),
    });
    const populated = await models_1.Transaction.findById(transaction._id).populate('category');
    return toTransactionData(populated);
};
exports.createTransaction = createTransaction;
const getTransactions = async (userId, query) => {
    const filter = { user: userId };
    if (query.type) {
        filter.type = query.type;
    }
    if (query.category) {
        if (!mongoose_1.Types.ObjectId.isValid(query.category)) {
            throw new AppError_1.AppError('Invalid category ID', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        filter.category = query.category;
    }
    if (query.startDate || query.endDate) {
        filter.transactionDate = {};
        if (query.startDate) {
            filter.transactionDate.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.transactionDate.$lte = new Date(query.endDate);
        }
    }
    const transactions = await models_1.Transaction.find(filter)
        .populate('category')
        .sort({ transactionDate: -1, createdAt: -1 });
    return transactions.map((tx) => toTransactionData(tx));
};
exports.getTransactions = getTransactions;
const getTransactionById = async (userId, transactionId) => {
    if (!mongoose_1.Types.ObjectId.isValid(transactionId)) {
        throw new AppError_1.AppError('Invalid transaction ID', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const transaction = await models_1.Transaction.findOne({ _id: transactionId, user: userId }).populate('category');
    if (!transaction) {
        throw new AppError_1.AppError('Transaction not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    return toTransactionData(transaction);
};
exports.getTransactionById = getTransactionById;
const updateTransaction = async (userId, transactionId, body) => {
    if (!mongoose_1.Types.ObjectId.isValid(transactionId)) {
        throw new AppError_1.AppError('Invalid transaction ID', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const transaction = await models_1.Transaction.findOne({ _id: transactionId, user: userId });
    if (!transaction) {
        throw new AppError_1.AppError('Transaction not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    const effectiveType = body.type ?? transaction.type;
    const effectiveCategoryId = body.category ?? transaction.category.toString();
    if (body.type !== undefined || body.category !== undefined) {
        await resolveCategory(userId, effectiveCategoryId, effectiveType);
    }
    if (body.category !== undefined)
        transaction.category = new mongoose_1.Types.ObjectId(body.category);
    if (body.type !== undefined)
        transaction.type = body.type;
    if (body.amount !== undefined)
        transaction.amount = body.amount;
    if (body.description !== undefined)
        transaction.description = body.description.trim();
    if (body.transactionDate !== undefined)
        transaction.transactionDate = new Date(body.transactionDate);
    await transaction.save();
    const populated = await models_1.Transaction.findById(transaction._id).populate('category');
    return toTransactionData(populated);
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (userId, transactionId) => {
    if (!mongoose_1.Types.ObjectId.isValid(transactionId)) {
        throw new AppError_1.AppError('Invalid transaction ID', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const transaction = await models_1.Transaction.findOne({ _id: transactionId, user: userId });
    if (!transaction) {
        throw new AppError_1.AppError('Transaction not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    await transaction.deleteOne();
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transaction.service.js.map