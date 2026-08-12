"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionHandler = exports.updateTransactionHandler = exports.getTransactionByIdHandler = exports.getTransactionsHandler = exports.createTransactionHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const transaction_service_1 = require("../services/transaction.service");
exports.createTransactionHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const body = req.body;
    const transaction = await (0, transaction_service_1.createTransaction)(req.user.id, body);
    (0, response_1.sendSuccess)(res, { transaction }, constants_1.HTTP_STATUS.CREATED);
});
exports.getTransactionsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const query = req.query;
    const transactions = await (0, transaction_service_1.getTransactions)(req.user.id, query);
    (0, response_1.sendSuccess)(res, { transactions });
});
exports.getTransactionByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const transaction = await (0, transaction_service_1.getTransactionById)(req.user.id, req.params.id);
    (0, response_1.sendSuccess)(res, { transaction });
});
exports.updateTransactionHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const body = req.body;
    const transaction = await (0, transaction_service_1.updateTransaction)(req.user.id, req.params.id, body);
    (0, response_1.sendSuccess)(res, { transaction });
});
exports.deleteTransactionHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    await (0, transaction_service_1.deleteTransaction)(req.user.id, req.params.id);
    (0, response_1.sendSuccess)(res, { message: 'Transaction deleted successfully' });
});
//# sourceMappingURL=transaction.controller.js.map