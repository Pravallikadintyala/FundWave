"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const savings_service_1 = require("./savings.service");
const MONTH_LABELS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const toTransactionData = (tx) => {
    const cat = tx.category;
    const categoryField = cat && typeof cat === 'object' && 'name' in cat
        ? {
            id: cat._id.toString(),
            user: cat.user.toString(),
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            color: cat.color,
            isDefault: cat.isDefault,
        }
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
const getDashboardData = async (userId) => {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const [summaryAgg, expenseByCategoryAgg, monthlyAgg, recentDocs, savings] = await Promise.all([
        models_1.Transaction.aggregate([
            { $match: { user: userObjectId } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]),
        models_1.Transaction.aggregate([
            { $match: { user: userObjectId, type: 'Expense' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDoc',
                },
            },
            { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    _id: '$categoryDoc.name',
                    total: 1,
                },
            },
            { $sort: { total: -1 } },
        ]),
        models_1.Transaction.aggregate([
            { $match: { user: userObjectId } },
            {
                $group: {
                    _id: {
                        year: { $year: '$transactionDate' },
                        month: { $month: '$transactionDate' },
                        type: '$type',
                    },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        models_1.Transaction.find({ user: userObjectId })
            .populate('category')
            .sort({ transactionDate: -1, createdAt: -1 })
            .limit(5)
            .lean(),
        (0, savings_service_1.getSavingsSummary)(userId),
    ]);
    const totals = {
        Income: { amount: 0, count: 0 },
        Expense: { amount: 0, count: 0 },
    };
    for (const row of summaryAgg) {
        totals[row._id] = { amount: row.total, count: row.count };
    }
    const summary = {
        totalIncome: totals['Income'].amount,
        totalExpenses: totals['Expense'].amount,
        currentBalance: totals['Income'].amount - totals['Expense'].amount,
        transactionCount: totals['Income'].count + totals['Expense'].count,
    };
    const expenseByCategory = expenseByCategoryAgg.map((row) => ({
        category: row._id,
        amount: row.total,
    }));
    const monthlyMap = new Map();
    for (const row of monthlyAgg) {
        const { year, month, type } = row._id;
        const key = `${year}-${String(month).padStart(2, '0')}`;
        const label = MONTH_LABELS[month - 1];
        if (!monthlyMap.has(key)) {
            monthlyMap.set(key, { month: label, income: 0, expense: 0 });
        }
        const entry = monthlyMap.get(key);
        if (type === 'Income') {
            entry.income = row.total;
        }
        else {
            entry.expense = row.total;
        }
    }
    const incomeVsExpense = [...monthlyMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v);
    const recentTransactions = recentDocs.map((doc) => toTransactionData(doc));
    return {
        summary,
        expenseByCategory,
        incomeVsExpense,
        recentTransactions,
        savings,
    };
};
exports.getDashboardData = getDashboardData;
//# sourceMappingURL=dashboard.service.js.map