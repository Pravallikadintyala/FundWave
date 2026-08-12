"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavingsSummary = exports.contribute = exports.deleteSavingsGoal = exports.updateSavingsGoal = exports.getSavingsGoalById = exports.getSavingsGoals = exports.createSavingsGoal = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const toGoalData = (doc) => {
    const progressPercent = doc.targetAmount > 0
        ? Math.min(parseFloat(((doc.currentAmount / doc.targetAmount) * 100).toFixed(2)), 100)
        : 0;
    return {
        id: doc._id.toString(),
        user: doc.user.toString(),
        title: doc.title,
        targetAmount: doc.targetAmount,
        currentAmount: doc.currentAmount,
        progressPercent,
        remainingAmount: Math.max(doc.targetAmount - doc.currentAmount, 0),
        targetDate: doc.targetDate,
        color: doc.color,
        icon: doc.icon,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
const findOwnedGoal = async (goalId, userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(goalId)) {
        throw new AppError_1.AppError('Invalid savings goal ID', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const goal = await models_1.SavingsGoal.findOne({
        _id: new mongoose_1.Types.ObjectId(goalId),
        user: new mongoose_1.Types.ObjectId(userId),
    });
    if (!goal) {
        throw new AppError_1.AppError('Savings goal not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    return goal;
};
const createSavingsGoal = async (userId, body) => {
    const goal = await models_1.SavingsGoal.create({
        user: new mongoose_1.Types.ObjectId(userId),
        title: body.title.trim(),
        targetAmount: body.targetAmount,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        color: body.color?.trim(),
        icon: body.icon?.trim(),
    });
    return toGoalData(goal);
};
exports.createSavingsGoal = createSavingsGoal;
const getSavingsGoals = async (userId) => {
    const goals = await models_1.SavingsGoal.find({ user: new mongoose_1.Types.ObjectId(userId) })
        .sort({ createdAt: -1 });
    return goals.map(toGoalData);
};
exports.getSavingsGoals = getSavingsGoals;
const getSavingsGoalById = async (goalId, userId) => {
    const goal = await findOwnedGoal(goalId, userId);
    return toGoalData(goal);
};
exports.getSavingsGoalById = getSavingsGoalById;
const updateSavingsGoal = async (goalId, userId, body) => {
    const goal = await findOwnedGoal(goalId, userId);
    if (body.title !== undefined)
        goal.title = body.title.trim();
    if (body.targetAmount !== undefined) {
        goal.targetAmount = body.targetAmount;
        if (goal.currentAmount > goal.targetAmount) {
            goal.currentAmount = goal.targetAmount;
        }
        if (goal.currentAmount >= goal.targetAmount && goal.status === 'Active') {
            goal.status = 'Completed';
        }
    }
    if (body.targetDate !== undefined) {
        goal.targetDate = body.targetDate ? new Date(body.targetDate) : undefined;
    }
    if (body.color !== undefined)
        goal.color = body.color.trim() || undefined;
    if (body.icon !== undefined)
        goal.icon = body.icon.trim() || undefined;
    if (body.status !== undefined)
        goal.status = body.status;
    await goal.save();
    return toGoalData(goal);
};
exports.updateSavingsGoal = updateSavingsGoal;
const deleteSavingsGoal = async (goalId, userId) => {
    const goal = await findOwnedGoal(goalId, userId);
    await goal.deleteOne();
};
exports.deleteSavingsGoal = deleteSavingsGoal;
const contribute = async (goalId, userId, body) => {
    const goal = await findOwnedGoal(goalId, userId);
    if (goal.status === 'Completed') {
        throw new AppError_1.AppError('This goal is already completed', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    if (goal.status === 'Archived') {
        throw new AppError_1.AppError('Cannot contribute to an archived goal', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const newAmount = goal.currentAmount + body.amount;
    if (newAmount > goal.targetAmount) {
        throw new AppError_1.AppError(`Contribution of ${body.amount} exceeds the remaining amount of ${(goal.targetAmount - goal.currentAmount).toFixed(2)}`, constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    goal.currentAmount = newAmount;
    if (goal.currentAmount >= goal.targetAmount) {
        goal.status = 'Completed';
    }
    await goal.save();
    return toGoalData(goal);
};
exports.contribute = contribute;
const getSavingsSummary = async (userId) => {
    const rows = await models_1.SavingsGoal.aggregate([
        { $match: { user: new mongoose_1.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalSaved: { $sum: '$currentAmount' },
            },
        },
    ]);
    let totalGoals = 0;
    let activeGoals = 0;
    let completedGoals = 0;
    let totalSaved = 0;
    for (const row of rows) {
        totalGoals += row.count;
        totalSaved += row.totalSaved;
        if (row._id === 'Active')
            activeGoals = row.count;
        if (row._id === 'Completed')
            completedGoals = row.count;
    }
    return { totalGoals, activeGoals, completedGoals, totalSaved };
};
exports.getSavingsSummary = getSavingsSummary;
//# sourceMappingURL=savings.service.js.map