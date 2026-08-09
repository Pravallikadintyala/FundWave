/**
 * Shared display formatters (Indian locale, INR).
 *
 * Kept framework-free so both hooks and components can use them.
 */

const INR = (fractionDigits: number): Intl.NumberFormat =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

/**
 * ₹50,000 for whole amounts, ₹1,250.50 when paise are present.
 * Never rounds away money the user actually saved.
 */
export const formatCurrency = (value: number): string =>
  INR(Number.isInteger(value) ? 0 : 2).format(value);

/** Compact form for tight spaces: ₹1.2L, ₹35.0K, ₹850 */
export const formatCompactCurrency = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (abs >= 100_000)    return `₹${(value / 100_000).toFixed(1)}L`;
  if (abs >= 1_000)      return `₹${(value / 1_000).toFixed(1)}K`;
  return formatCurrency(value);
};

/** 12 Aug 2026 */
export const formatDate = (value: string | Date): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

/** ISO date (yyyy-mm-dd) suitable for <input type="date"> */
export const toDateInputValue = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
};

/** Today as yyyy-mm-dd — used as the `min` for target dates. */
export const todayInputValue = (): string => toDateInputValue(new Date().toISOString());

/**
 * Whole days from today until `value`.
 * Negative when the date is in the past. Compared date-only, so "today" is 0.
 */
export const daysUntil = (value: string | Date): number => {
  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

/** "in 42 days" / "in 3 months" / "2 days ago" / "today" */
export const formatRelativeDays = (days: number): string => {
  if (days === 0) return 'today';
  const abs = Math.abs(days);
  const unit =
    abs >= 365 ? `${Math.round(abs / 365)} year${Math.round(abs / 365) === 1 ? '' : 's'}`
    : abs >= 60 ? `${Math.round(abs / 30)} months`
    : `${abs} day${abs === 1 ? '' : 's'}`;
  return days > 0 ? `in ${unit}` : `${unit} ago`;
};
