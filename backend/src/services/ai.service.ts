/**
 * AI Insights service.
 *
 * Workflow:
 *   1. Reuse getDashboardData to collect all user financial data in one shot.
 *   2. Summarise the raw data into a rich FinancialContext with derived metrics.
 *   3. Build a detailed, structured prompt and call Gemini.
 *   4. Parse and validate the JSON response.
 *   5. Return a typed AIInsightsData object, or a meaningful fallback.
 */

import { getDashboardData } from './dashboard.service';
import generateInsight from './ai/gemini.services';
import { AIInsightsData, FinancialContext } from '../types/ai.types';
import { TransactionData } from '../types/finance.types';
import InsightsCache from '../models/insightsCache.model';
import { Types } from 'mongoose';

// ─── Fallback responses ───────────────────────────────────────────────────────

const FALLBACK: AIInsightsData = {
  summary:
    'We were unable to generate personalised insights at this time. Please try again shortly.',
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

const LOW_ACTIVITY: AIInsightsData = {
  summary:
    'Not enough financial activity was found to generate detailed insights. Start by logging your income and expenses to unlock personalized AI analysis.',
  strengths: ['You have set up your FundWave account — you are already ahead of most people.'],
  concerns: ['Very few or no transactions recorded yet.'],
  recommendations: [
    'Log your first income or expense transaction to get started.',
    'Create at least one savings goal with a target date.',
    'Categorise your spending so you can see exactly where your money goes.',
  ],
  savingsTip: 'The best time to start tracking your finances was yesterday. The second best time is now.',
  overallScore: 0,
};

// ─── Context builder ──────────────────────────────────────────────────────────

const buildRecentSummary = (recent: TransactionData[]): string => {
  if (recent.length === 0) return 'No recent transactions.';
  return recent
    .map((tx) => {
      const cat =
        tx.category && typeof tx.category === 'object' ? tx.category.name : 'Uncategorised';
      return `${tx.type} ₹${tx.amount.toLocaleString('en-IN')} in ${cat} — "${tx.description || 'no description'}"`;
    })
    .join('; ');
};

const buildContext = (
  dashboardData: Awaited<ReturnType<typeof getDashboardData>>,
): FinancialContext => ({
  totalIncome: dashboardData.summary.totalIncome,
  totalExpenses: dashboardData.summary.totalExpenses,
  currentBalance: dashboardData.summary.currentBalance,
  transactionCount: dashboardData.summary.transactionCount,
  topExpenseCategories: dashboardData.expenseByCategory.slice(0, 6),
  monthlyTrend: dashboardData.incomeVsExpense.slice(-6),
  savingsGoals: dashboardData.savings,
  recentTransactionSummary: buildRecentSummary(dashboardData.recentTransactions),
});

// ─── Prompt builder ───────────────────────────────────────────────────────────

const buildPrompt = (ctx: FinancialContext): string => {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  // Derived metrics to give Gemini richer signals
  const savingsRate =
    ctx.totalIncome > 0
      ? (((ctx.totalIncome - ctx.totalExpenses) / ctx.totalIncome) * 100).toFixed(1)
      : '0.0';
  const expenseRatio =
    ctx.totalIncome > 0
      ? ((ctx.totalExpenses / ctx.totalIncome) * 100).toFixed(1)
      : '0.0';
  const avgMonthlyIncome =
    ctx.monthlyTrend.length > 0
      ? Math.round(ctx.monthlyTrend.reduce((s, m) => s + m.income, 0) / ctx.monthlyTrend.length)
      : 0;
  const avgMonthlyExpense =
    ctx.monthlyTrend.length > 0
      ? Math.round(ctx.monthlyTrend.reduce((s, m) => s + m.expense, 0) / ctx.monthlyTrend.length)
      : 0;

  const overspendMonths = ctx.monthlyTrend.filter((m) => m.expense > m.income);
  const topCat = ctx.topExpenseCategories[0];

  const savingsGoalSection =
    ctx.savingsGoals.totalGoals === 0
      ? '  - No savings goals created yet.'
      : [
        `  - Total goals: ${ctx.savingsGoals.totalGoals}`,
        `  - Active goals: ${ctx.savingsGoals.activeGoals}`,
        `  - Completed goals: ${ctx.savingsGoals.completedGoals}`,
        `  - Total saved across all goals: ${fmt(ctx.savingsGoals.totalSaved)}`,
      ].join('\n');

  const monthlyTrendSection =
    ctx.monthlyTrend.length === 0
      ? '  - No monthly data available yet.'
      : ctx.monthlyTrend
        .map((m) => {
          const net = m.income - m.expense;
          const direction = net >= 0 ? `surplus ${fmt(net)}` : `deficit ${fmt(Math.abs(net))}`;
          return `  - ${m.month}: income ${fmt(m.income)}, expenses ${fmt(m.expense)} → ${direction}`;
        })
        .join('\n');

  const categorySection =
    ctx.topExpenseCategories.length === 0
      ? '  - No expense categories recorded yet.'
      : ctx.topExpenseCategories
        .map((c, i) => {
          const pct =
            ctx.totalExpenses > 0
              ? ((c.amount / ctx.totalExpenses) * 100).toFixed(1)
              : '0.0';
          return `  ${i + 1}. ${c.category}: ${fmt(c.amount)} (${pct}% of total spending)`;
        })
        .join('\n');

  return `
You are a highly skilled, empathetic personal finance advisor AI for FundWave — an Indian personal finance app. Your job is to analyse a user's real financial data and generate concise, specific, and actionable insights.

=== USER'S FINANCIAL SUMMARY ===

OVERALL FIGURES (all-time):
  - Total income recorded:     ${fmt(ctx.totalIncome)}
  - Total expenses recorded:   ${fmt(ctx.totalExpenses)}
  - Current net balance:       ${fmt(ctx.currentBalance)}
  - Total transactions logged: ${ctx.transactionCount}

KEY DERIVED METRICS:
  - Savings rate:              ${savingsRate}%  (income minus expenses as % of income)
  - Expense ratio:             ${expenseRatio}%  (expenses as % of income)
  - Average monthly income:    ${fmt(avgMonthlyIncome)}
  - Average monthly expenses:  ${fmt(avgMonthlyExpense)}
  - Months with overspending:  ${overspendMonths.length > 0 ? overspendMonths.map((m) => m.month).join(', ') : 'None'}

TOP EXPENSE CATEGORIES (ranked by total spend):
${categorySection}
${topCat ? `\n  → Biggest spending area: "${topCat.category}" at ${fmt(topCat.amount)}.` : ''}

MONTHLY INCOME VS EXPENSE TREND (last 6 months):
${monthlyTrendSection}

SAVINGS GOALS:
${savingsGoalSection}

RECENT TRANSACTIONS (last 5):
  ${ctx.recentTransactionSummary}

=== YOUR TASK ===

Based on this data, generate personalised financial insights. Be specific — reference real numbers, percentages, and category names. Use INR (₹). Write for an Indian audience.

Scoring guide for overallScore (0–100):
  - 80–100: Excellent. Savings rate > 20%, no overspending months, active goals.
  - 60–79:  Good. Savings rate 10–20%, occasional overspending, some goals.
  - 40–59:  Needs attention. Savings rate < 10%, frequent overspending, or no goals.
  - 0–39:   Needs improvement. Expenses exceed income, no savings, erratic cash flow.

Adjust the score based on the actual data above. Do not default to a round number.

Respond ONLY with a valid JSON object in exactly this structure (no markdown, no code fences, no explanation text):
{
  "summary": "<2-3 sentence personalised overview mentioning actual figures>",
  "strengths": ["<specific strength with a real number or fact>", "<another strength>"],
  "concerns": ["<specific concern with real numbers>", "<another concern if applicable>"],
  "recommendations": [
    "<actionable recommendation #1 — specific, tied to the user's data>",
    "<actionable recommendation #2>",
    "<actionable recommendation #3>"
  ],
  "savingsTip": "<one practical, specific savings tip tailored to this user's biggest expense or pattern>",
  "overallScore": <integer 0-100>
}

Rules:
  - All fields required. Arrays must have at least 1 item.
  - overallScore must be an integer 0–100.
  - Reference actual ₹ figures and category names — never be generic.
  - If data is limited, still generate useful insights based on what is available.
`.trim();
};

// ─── JSON parser / validator ──────────────────────────────────────────────────

const isValidInsights = (obj: unknown): obj is AIInsightsData => {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o['summary'] === 'string' &&
    Array.isArray(o['strengths']) && (o['strengths'] as unknown[]).length > 0 &&
    Array.isArray(o['concerns']) && (o['concerns'] as unknown[]).length > 0 &&
    Array.isArray(o['recommendations']) && (o['recommendations'] as unknown[]).length > 0 &&
    typeof o['savingsTip'] === 'string' &&
    typeof o['overallScore'] === 'number'
  );
};

const parseGeminiResponse = (raw: string): AIInsightsData | null => {
  // Strip accidental markdown code fences Gemini sometimes emits
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    const parsed: unknown = JSON.parse(cleaned);
    return isValidInsights(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

// ─── Cache helpers ───────────────────────────────────────────────────────────

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — one Gemini call per user per day max

// ─── Main export ──────────────────────────────────────────────────────────────

export const getAIInsights = async (userId: string): Promise<AIInsightsData> => {
  const dashboardData = await getDashboardData(userId);
  const { transactionCount } = dashboardData.summary;

  if (transactionCount === 0) {
    return LOW_ACTIVITY;
  }

  // ── Check MongoDB cache ───────────────────────────────────────────────────
  const cached = await InsightsCache.findOne({ user: new Types.ObjectId(userId) }).lean();
  const now = Date.now();

  if (
    cached &&
    new Date(cached.expiresAt).getTime() > now &&
    cached.transactionCount === transactionCount
  ) {
    console.log('[AI] Returning cached insights for user', userId);
    return cached.data as unknown as AIInsightsData;
  }

  // ── Call Gemini ───────────────────────────────────────────────────────────
  const context = buildContext(dashboardData);
  const prompt = buildPrompt(context);

  try {
    const raw = await generateInsight(prompt);
    const parsed = parseGeminiResponse(raw);

    if (!parsed) {
      console.error('[AI] Gemini returned unparseable response:', raw.slice(0, 400));
      return cached ? (cached.data as unknown as AIInsightsData) : FALLBACK;
    }

    // Clamp overallScore to [0, 100]
    parsed.overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore)));

    // Upsert cache — one doc per user, auto-deleted by MongoDB TTL index after 24h
    await InsightsCache.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {
        data: parsed as unknown as Record<string, unknown>,
        transactionCount,
        expiresAt: new Date(now + CACHE_TTL_MS),
      },
      { upsert: true, new: true },
    );

    return parsed;
  } catch (err) {
    console.error('[AI] Gemini call failed:', err instanceof Error ? err.message : err);
    // Return stale cache if available rather than the generic fallback
    return cached ? (cached.data as unknown as AIInsightsData) : FALLBACK;
  }
};
