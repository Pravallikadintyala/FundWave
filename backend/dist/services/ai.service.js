"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIInsights = void 0;
const dashboard_service_1 = require("./dashboard.service");
const gemini_services_1 = __importDefault(require("./ai/gemini.services"));
const FALLBACK = {
    summary: 'We were unable to generate personalised insights at this time. Please try again shortly.',
    strengths: ['You are tracking your finances — that is already a great habit.'],
    concerns: ['Insights are temporarily unavailable.'],
    recommendations: [
        'Continue logging your transactions regularly.',
        'Review your spending categories each week.',
        'Set a savings goal to stay motivated.',
    ],
    savingsTip: 'Even saving a small amount consistently builds long-term financial resilience.',
    overallScore: 0,
};
const LOW_ACTIVITY = {
    summary: 'Not enough financial activity was found to generate detailed insights. Start by logging your income and expenses.',
    strengths: ['You have set up your FundWave account — you are on the right track.'],
    concerns: ['Very few or no transactions recorded yet.'],
    recommendations: [
        'Log your first income or expense transaction.',
        'Create at least one savings goal.',
        'Categorise your spending to see where your money goes.',
    ],
    savingsTip: 'The best time to start tracking your finances was yesterday. The second best time is now.',
    overallScore: 0,
};
const buildRecentSummary = (recent) => {
    if (recent.length === 0)
        return 'No recent transactions.';
    return recent
        .map((tx) => {
        const cat = tx.category && typeof tx.category === 'object' ? tx.category.name : 'Uncategorised';
        return `${tx.type} ₹${tx.amount} (${cat})`;
    })
        .join('; ');
};
const buildContext = (dashboardData) => ({
    totalIncome: dashboardData.summary.totalIncome,
    totalExpenses: dashboardData.summary.totalExpenses,
    currentBalance: dashboardData.summary.currentBalance,
    transactionCount: dashboardData.summary.transactionCount,
    topExpenseCategories: dashboardData.expenseByCategory.slice(0, 5),
    monthlyTrend: dashboardData.incomeVsExpense.slice(-6),
    savingsGoals: dashboardData.savings,
    recentTransactionSummary: buildRecentSummary(dashboardData.recentTransactions),
});
const buildPrompt = (ctx) => `
You are a personal finance advisor AI. Analyse the following summarised financial data and respond with a JSON object only — no markdown, no explanation, no code fences.

Financial summary:
- Total income: ₹${ctx.totalIncome}
- Total expenses: ₹${ctx.totalExpenses}
- Current balance: ₹${ctx.currentBalance}
- Total transactions logged: ${ctx.transactionCount}

Top expense categories (by amount):
${ctx.topExpenseCategories.length > 0
    ? ctx.topExpenseCategories.map((c) => `  - ${c.category}: ₹${c.amount}`).join('\n')
    : '  - None recorded'}

Monthly income vs expense trend (recent months):
${ctx.monthlyTrend.length > 0
    ? ctx.monthlyTrend.map((m) => `  - ${m.month}: income ₹${m.income}, expense ₹${m.expense}`).join('\n')
    : '  - No monthly data'}

Savings goals:
- Total goals: ${ctx.savingsGoals.totalGoals}
- Active goals: ${ctx.savingsGoals.activeGoals}
- Completed goals: ${ctx.savingsGoals.completedGoals}
- Total saved across all goals: ₹${ctx.savingsGoals.totalSaved}

Recent transactions summary:
${ctx.recentTransactionSummary}

Respond ONLY with a JSON object in exactly this structure:
{
  "summary": "<2-3 sentence overview of the user's financial health>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "concerns": ["<concern 1>", "<concern 2>"],
  "recommendations": ["<actionable recommendation 1>", "<actionable recommendation 2>", "<actionable recommendation 3>"],
  "savingsTip": "<one specific savings tip relevant to this user's data>",
  "overallScore": <integer 0-100 representing overall financial health>
}

Rules:
- Respond with valid JSON only. No markdown. No code fences.
- strengths, concerns, and recommendations must each be non-empty arrays.
- overallScore must be an integer between 0 and 100.
- Be specific and actionable. Reference the actual figures where helpful.
`.trim();
const isValidInsights = (obj) => {
    if (!obj || typeof obj !== 'object')
        return false;
    const o = obj;
    return (typeof o['summary'] === 'string' &&
        Array.isArray(o['strengths']) &&
        Array.isArray(o['concerns']) &&
        Array.isArray(o['recommendations']) &&
        typeof o['savingsTip'] === 'string' &&
        typeof o['overallScore'] === 'number');
};
const parseGeminiResponse = (raw) => {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
        const parsed = JSON.parse(cleaned);
        return isValidInsights(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
};
const getAIInsights = async (userId) => {
    const dashboardData = await (0, dashboard_service_1.getDashboardData)(userId);
    if (dashboardData.summary.transactionCount === 0) {
        return LOW_ACTIVITY;
    }
    const context = buildContext(dashboardData);
    const prompt = buildPrompt(context);
    try {
        const raw = await (0, gemini_services_1.default)(prompt);
        const parsed = parseGeminiResponse(raw);
        if (!parsed) {
            console.error('[AI] Gemini returned unparseable response:', raw.slice(0, 300));
            return FALLBACK;
        }
        parsed.overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore)));
        return parsed;
    }
    catch (err) {
        console.error('[AI] Gemini call failed:', err instanceof Error ? err.message : err);
        return FALLBACK;
    }
};
exports.getAIInsights = getAIInsights;
//# sourceMappingURL=ai.service.js.map