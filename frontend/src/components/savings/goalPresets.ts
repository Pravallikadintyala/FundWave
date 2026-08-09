/**
 * Presentation presets for savings goals.
 *
 * `icon` and `color` are free-form strings on the backend model, so the UI
 * offers a curated set instead of an arbitrary picker — every value stored is
 * still just a string the existing API already accepts.
 */

export const GOAL_ICONS = [
  '🎯', '🏠', '🚗', '✈️', '🎓', '💍',
  '💻', '📱', '🏥', '🎁', '🐖', '🌴',
  '📈', '🛠️', '👶', '🐾',
] as const;

export const GOAL_COLORS = [
  '#6366f1', // indigo (primary)
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#ef4444', // red
] as const;

export const DEFAULT_GOAL_ICON = GOAL_ICONS[0];

/**
 * Stable fallback accent for goals saved without a colour — same goal always
 * gets the same hue, so the grid never reshuffles its palette on re-render.
 */
export const accentForGoal = (goal: { id: string; color?: string }): string => {
  if (goal.color) return goal.color;
  let hash = 0;
  for (let i = 0; i < goal.id.length; i += 1) {
    hash = (hash * 31 + goal.id.charCodeAt(i)) % 997;
  }
  return GOAL_COLORS[hash % GOAL_COLORS.length];
};
