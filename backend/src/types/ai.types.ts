/**
 * AI Insights module TypeScript interfaces.
 */

// ─── Gemini response shape ────────────────────────────────────────────────────

export interface AIInsightsData {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  savingsTip: string;
  overallScore: number;
}

// ─── Internal prompt context (summarised before sending to Gemini) ────────────

export interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  transactionCount: number;
  topExpenseCategories: { category: string; amount: number }[];
  monthlyTrend: { month: string; income: number; expense: number }[];
  savingsGoals: {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalSaved: number;
  };
  recentTransactionSummary: string;   // human-readable narrative built in service
}
