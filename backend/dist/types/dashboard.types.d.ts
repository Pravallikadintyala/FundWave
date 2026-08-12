import { TransactionData } from './finance.types';
export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    transactionCount: number;
}
export interface ExpenseByCategory {
    category: string;
    amount: number;
}
export interface MonthlyIncomeVsExpense {
    month: string;
    income: number;
    expense: number;
}
export interface SavingsSummary {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalSaved: number;
}
export interface DashboardData {
    summary: DashboardSummary;
    expenseByCategory: ExpenseByCategory[];
    incomeVsExpense: MonthlyIncomeVsExpense[];
    recentTransactions: TransactionData[];
    savings: SavingsSummary;
}
//# sourceMappingURL=dashboard.types.d.ts.map