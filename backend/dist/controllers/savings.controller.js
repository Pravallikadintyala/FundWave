"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contributeToGoal = exports.deleteGoal = exports.updateGoal = exports.getGoalById = exports.getGoals = exports.createGoal = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const savings_service_1 = require("../services/savings.service");
const requireUser = (req) => {
    if (!req.user?.id)
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    return req.user.id;
};
exports.createGoal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, savings_service_1.createSavingsGoal)(requireUser(req), req.body);
    (0, response_1.sendSuccess)(res, { goal: data }, constants_1.HTTP_STATUS.CREATED);
});
exports.getGoals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, savings_service_1.getSavingsGoals)(requireUser(req));
    (0, response_1.sendSuccess)(res, { goals: data });
});
exports.getGoalById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, savings_service_1.getSavingsGoalById)(req.params.id, requireUser(req));
    (0, response_1.sendSuccess)(res, { goal: data });
});
exports.updateGoal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, savings_service_1.updateSavingsGoal)(req.params.id, requireUser(req), req.body);
    (0, response_1.sendSuccess)(res, { goal: data });
});
exports.deleteGoal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, savings_service_1.deleteSavingsGoal)(req.params.id, requireUser(req));
    (0, response_1.sendSuccess)(res, { message: 'Savings goal deleted successfully' });
});
exports.contributeToGoal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, savings_service_1.contribute)(req.params.id, requireUser(req), req.body);
    (0, response_1.sendSuccess)(res, { goal: data });
});
//# sourceMappingURL=savings.controller.js.map