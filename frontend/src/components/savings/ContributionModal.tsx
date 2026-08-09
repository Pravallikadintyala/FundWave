/**
 * ContributionModal — "Add Money" to an active goal.
 *
 * POST /savings-goals/:id/contribute accepts `{ amount }` only, so amount is the
 * single field here. Validation mirrors the server rules exactly:
 *   - amount must be a number greater than zero
 *   - amount cannot exceed the goal's remaining amount
 * so the user is told before the request is ever sent.
 */

import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { accentForGoal, DEFAULT_GOAL_ICON } from '@/components/savings/goalPresets';
import { formatCurrency, getCurrencySymbol } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';
import type { MutationResult } from '@/hooks/useSavingsGoals';
import type { SavingsGoal } from '@/types';

// Round to paise so float noise never trips the server-side comparison.
const round2 = (value: number): number => Math.round(value * 100) / 100;

interface ContributionModalProps {
  open:     boolean;
  goal:     SavingsGoal | null;
  onClose:  () => void;
  onSubmit: (id: string, amount: number) => Promise<MutationResult>;
}

const ContributionModal = ({ open, goal, onClose, onSubmit }: ContributionModalProps) => {
  const [amount, setAmount]         = useState('');
  const [error, setError]           = useState<string | null>(null);

  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency);

  const remaining = goal ? round2(goal.targetAmount - goal.currentAmount) : 0;
  const [formError, setFormError]   = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const amountId = useId();

  useEffect(() => {
    if (open) {
      setAmount('');
      setError(null);
      setFormError(null);
      setSubmitting(false);
    }
  }, [open, goal]);

  if (!goal) return null;

  const parsed    = Number(amount);
  const isNumeric = amount.trim() !== '' && !Number.isNaN(parsed);
  const newTotal  = isNumeric ? round2(Math.min(goal.currentAmount + parsed, goal.targetAmount)) : goal.currentAmount;
  const newPercent =
    goal.targetAmount > 0 ? Math.min(100, (newTotal / goal.targetAmount) * 100) : 0;
  const willComplete = isNumeric && parsed > 0 && round2(parsed) >= remaining;

  const quickAmounts = [
    { label: '25%', value: round2(remaining * 0.25) },
    { label: '50%', value: round2(remaining * 0.5) },
    { label: 'All remaining', value: remaining },
  ].filter(option => option.value > 0);

  const setValue = (next: string) => {
    setAmount(next);
    setError(null);
    setFormError(null);
  };

  const validate = (): boolean => {
    if (!amount.trim()) {
      setError('Enter an amount to add');
      return false;
    }
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }
    if (round2(parsed) > remaining) {
      setError(`Amount cannot exceed the ${formatCurrency(remaining)} still remaining`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setFormError(null);
    const result = await onSubmit(goal.id, round2(parsed));
    setSubmitting(false);

    if (result.success) onClose();
    else setFormError(result.message ?? 'Could not add money to this goal.');
  };

  const modalStyle = { '--goal-accent': accentForGoal(goal) } as CSSProperties;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Money"
      description={`Put more towards “${goal.title}”.`}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="txmodal-form" noValidate style={modalStyle}>
        {formError && <p className="sg-form-banner" role="alert">{formError}</p>}

        {/* ── Goal context ───────────────────────────────────────────────── */}
        <div className="sg-contrib-goal">
          <span className="sg-contrib-goal__icon" aria-hidden="true">
            {goal.icon || DEFAULT_GOAL_ICON}
          </span>
          <div className="sg-contrib-goal__text">
            <span className="sg-contrib-goal__title">{goal.title}</span>
            <span className="sg-contrib-goal__meta">
              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} saved ·{' '}
              {formatCurrency(remaining)} to go
            </span>
          </div>
        </div>

        {/* ── Amount ─────────────────────────────────────────────────────── */}
        <div className="txmodal-form__field">
          <label htmlFor={amountId} className="txmodal-form__label">
            Amount <span aria-hidden="true">*</span>
          </label>
          <div className="txmodal-form__amount-wrap" style={{ marginTop: 'var(--space-2)' }}>
            <span className="txmodal-form__currency" aria-hidden="true">{currencySymbol}</span>
            <input
              id={amountId}
              type="number"
              min="0.01"
              max={remaining}
              step="0.01"
              placeholder="0.00"
              autoFocus
              className={[
                'txmodal-form__input txmodal-form__input--amount',
                error ? 'txmodal-form__input--error' : '',
              ].filter(Boolean).join(' ')}
              value={amount}
              onChange={e => setValue(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${amountId}-err` : `${amountId}-help`}
            />
          </div>
          {error ? (
            <p id={`${amountId}-err`} className="txmodal-form__error" role="alert">{error}</p>
          ) : (
            <p id={`${amountId}-help`} className="sg-field-help">
              Up to {formatCurrency(remaining)} can be added to this goal.
            </p>
          )}
        </div>

        {/* ── Quick amounts ──────────────────────────────────────────────── */}
        {quickAmounts.length > 0 && (
          <div className="sg-quick-amounts" role="group" aria-label="Quick amounts">
            {quickAmounts.map(option => (
              <button
                key={option.label}
                type="button"
                className="sg-quick-amounts__btn"
                onClick={() => setValue(String(option.value))}
              >
                {option.label}
                <span>{formatCurrency(option.value)}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Live preview ───────────────────────────────────────────────── */}
        {isNumeric && parsed > 0 && !error && (
          <div className="sg-contrib-preview" role="status">
            <div className="sg-contrib-preview__row">
              <span>New saved total</span>
              <strong>{formatCurrency(newTotal)}</strong>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${newPercent}%` }} />
            </div>
            <p className="sg-contrib-preview__note">
              {willComplete
                ? '🎉 This contribution completes your goal.'
                : `${newPercent.toFixed(0)}% of your target after this contribution.`}
            </p>
          </div>
        )}

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="txmodal-form__actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Add Money
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributionModal;
