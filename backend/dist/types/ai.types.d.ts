export interface AIInsightsData {
    summary: string;
    strengths: string[];
    concerns: string[];
    recommendations: string[];
    savingsTip: string;
    overallScore: number;
}
export interface FinancialContext {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    transactionCount: number;
    topExpenseCategories: {
        category: string;
        amount: number;
    }[];
    monthlyTrend: {
        month: string;
        income: number;
        expense: number;
    }[];
    savingsGoals: {
        totalGoals: number;
        activeGoals: number;
        completedGoals: number;
        totalSaved: number;
    };
    recentTransactionSummary: string;
}
//# sourceMappingURL=ai.types.d.ts.map