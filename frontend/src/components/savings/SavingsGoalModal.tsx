/**
 * SavingsGoalModal — one modal for both creating and editing a savings goal.
 *
 * Fields map exactly to the backend model: title, targetAmount, targetDate,
 * icon, color. (The model has no description field, so none is offered.)
 *
 * - Client-side validation with inline messages
 * - Backend validation errors surface in a banner above the form
 * - Submit is disabled while the request is in flight
 * - On edit, only changed fields are sent (PUT accepts a partial body)
 */

import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  GOAL_COLORS,
  GOAL_ICONS,
  DEFAULT_GOAL_ICON,
  accentForGoal,
} from '@/components/savings/goalPresets';
import { formatCurrency, toDateInputValue, todayInputValue } from '@/utils/format';
import type { MutationResult } from '@/hooks/useSavingsGoals';
import type {
  CreateSavingsGoalPayload,
  UpdateSavingsGoalPayload,
} from '@/services/savingsGoalService';
import type { SavingsGoal } from '@/types';

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  title:        string;
  targetAmount: string;
  targetDate:   string;
  icon:         string;
  color:        string;
}

interface FormErrors {
  title?:        string;
  targetAmount?: string;
  targetDate?:   string;
}

const initForm = (goal?: SavingsGoal | null): FormState => ({
  title:        goal?.title ?? '',
  targetAmount: goal?.targetAmount != null ? String(goal.targetAmount) : '',
  targetDate:   toDateInputValue(goal?.targetDate),
  icon:         goal?.icon || DEFAULT_GOAL_ICON,
  color:        goal?.color || GOAL_COLORS[0],
});

const MAX_TITLE = 100;

// ─── Component ─────────────────────────────────────────────────────────────────

interface SavingsGoalModalProps {
  open:        boolean;
  onClose:     () => void;
  editingGoal: SavingsGoal | null;
  onCreate:    (payload: CreateSavingsGoalPayload) => Promise<MutationResult>;
  onUpdate:    (id: string, payload: UpdateSavingsGoalPayload) => Promise<MutationResult>;
}

const SavingsGoalModal = ({
  open,
  onClose,
  editingGoal,
  onCreate,
  onUpdate,
}: SavingsGoalModalProps) => {
  const [form, setForm]             = useState<FormState>(() => initForm(editingGoal));
  const [errors, setErrors]         = useState<FormErrors>({});
  const [formError, setFormError]   = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const titleId  = useId();
  const amountId = useId();
  const dateId   = useId();

  const isEdit = Boolean(editingGoal);

  // Reset whenever the modal opens (or switches between create / edit)
  useEffect(() => {
    if (open) {
      setForm(initForm(editingGoal));
      setErrors({});
      setFormError(null);
      setSubmitting(false);
    }
  }, [open, editingGoal]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setFormError(null);
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const next: FormErrors = {};
    const title = form.title.trim();

    if (!title) {
      next.title = 'Give your goal a name';
    } else if (title.length > MAX_TITLE) {
      next.title = `Name must be at most ${MAX_TITLE} characters`;
    }

    const amount = Number(form.targetAmount);
    if (!form.targetAmount.trim()) {
      next.targetAmount = 'Enter a target amount';
    } else if (Number.isNaN(amount) || amount <= 0) {
      next.targetAmount = 'Target amount must be greater than zero';
    }

    if (form.targetDate) {
      const parsed = new Date(form.targetDate);
      if (Number.isNaN(parsed.getTime())) {
        next.targetDate = 'Enter a valid date';
      } else if (!isEdit && form.targetDate < todayInputValue()) {
        next.targetDate = 'Target date cannot be in the past';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    const title  = form.title.trim();
    const amount = Number(form.targetAmount);

    setSubmitting(true);
    setFormError(null);

    let result: MutationResult;

    if (editingGoal) {
      // Send only what actually changed — PUT accepts a partial body.
      const payload: UpdateSavingsGoalPayload = {};
      if (title !== editingGoal.title)                  payload.title = title;
      if (amount !== editingGoal.targetAmount)           payload.targetAmount = amount;
      if (form.targetDate !== toDateInputValue(editingGoal.targetDate)) {
        payload.targetDate = form.targetDate; // '' clears the date server-side
      }
      if (form.icon !== (editingGoal.icon ?? ''))        payload.icon = form.icon;
      if (form.color !== (editingGoal.color ?? ''))      payload.color = form.color;

      if (Object.keys(payload).length === 0) {
        setSubmitting(false);
        setFormError('Nothing to save yet — change a field first.');
        return;
      }

      result = await onUpdate(editingGoal.id, payload);
    } else {
      const payload: CreateSavingsGoalPayload = {
        title,
        targetAmount: amount,
        icon:  form.icon,
        color: form.color,
      };
      if (form.targetDate) payload.targetDate = form.targetDate;

      result = await onCreate(payload);
    }

    setSubmitting(false);

    if (result.success) onClose();
    else setFormError(result.message ?? 'Something went wrong. Please try again.');
  };

  // ── Derived hints ──────────────────────────────────────────────────────────

  const newTarget = Number(form.targetAmount);
  const clampedSavedAmount =
    editingGoal && !Number.isNaN(newTarget) && newTarget > 0 && newTarget < editingGoal.currentAmount
      ? editingGoal.currentAmount
      : null;

  const previewStyle = {
    '--goal-accent': form.color || accentForGoal({ id: editingGoal?.id ?? 'preview' }),
  } as CSSProperties;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Goal' : 'Create Goal'}
      description={
        isEdit
          ? 'Update the details of this savings goal.'
          : 'Name it, set a target, and start making progress.'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="txmodal-form" noValidate>
        {/* ── Backend / form-level error ─────────────────────────────────── */}
        {formError && (
          <p className="sg-form-banner" role="alert">{formError}</p>
        )}

        {/* ── Live preview ───────────────────────────────────────────────── */}
        <div className="sg-preview" style={previewStyle} aria-hidden="true">
          <span className="sg-preview__icon">{form.icon || DEFAULT_GOAL_ICON}</span>
          <div className="sg-preview__text">
            <span className="sg-preview__title">{form.title.trim() || 'Your goal name'}</span>
            <span className="sg-preview__amount">
              {newTarget > 0 ? `Target ${formatCurrency(newTarget)}` : 'Target amount'}
            </span>
          </div>
        </div>

        {/* ── Name ───────────────────────────────────────────────────────── */}
        <div className="txmodal-form__field">
          <label htmlFor={titleId} className="txmodal-form__label">
            Goal name <span aria-hidden="true">*</span>
          </label>
          <input
            id={titleId}
            type="text"
            maxLength={MAX_TITLE}
            placeholder="e.g. Emergency fund"
            className={['txmodal-form__input', errors.title ? 'txmodal-form__input--error' : ''].filter(Boolean).join(' ')}
            value={form.title}
            onChange={e => set('title', e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${titleId}-err` : undefined}
          />
          {errors.title && (
            <p id={`${titleId}-err`} className="txmodal-form__error" role="alert">{errors.title}</p>
          )}
        </div>

        {/* ── Target amount + date ───────────────────────────────────────── */}
        <div className="txmodal-form__grid">
          <div className="txmodal-form__field">
            <label htmlFor={amountId} className="txmodal-form__label">
              Target amount <span aria-hidden="true">*</span>
            </label>
            <div className="txmodal-form__amount-wrap">
              <span className="txmodal-form__currency" aria-hidden="true">₹</span>
              <input
                id={amountId}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="50000"
                className={[
                  'txmodal-form__input txmodal-form__input--amount',
                  errors.targetAmount ? 'txmodal-form__input--error' : '',
                ].filter(Boolean).join(' ')}
                value={form.targetAmount}
                onChange={e => set('targetAmount', e.target.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.targetAmount)}
                aria-describedby={errors.targetAmount ? `${amountId}-err` : undefined}
              />
            </div>
            {errors.targetAmount && (
              <p id={`${amountId}-err`} className="txmodal-form__error" role="alert">{errors.targetAmount}</p>
            )}
          </div>

          <div className="txmodal-form__field">
            <label htmlFor={dateId} className="txmodal-form__label">
              Target date <span className="txmodal-form__optional">(optional)</span>
            </label>
            <input
              id={dateId}
              type="date"
              className={['txmodal-form__input', errors.targetDate ? 'txmodal-form__input--error' : ''].filter(Boolean).join(' ')}
              value={form.targetDate}
              min={isEdit ? undefined : todayInputValue()}
              onChange={e => set('targetDate', e.target.value)}
              aria-invalid={Boolean(errors.targetDate)}
              aria-describedby={errors.targetDate ? `${dateId}-err` : undefined}
            />
            {errors.targetDate && (
              <p id={`${dateId}-err`} className="txmodal-form__error" role="alert">{errors.targetDate}</p>
            )}
          </div>
        </div>

        {clampedSavedAmount !== null && (
          <p className="sg-form-hint" role="status">
            Your saved amount ({formatCurrency(clampedSavedAmount)}) is higher than this target —
            saving will cap it at the new target and mark the goal completed.
          </p>
        )}

        {/* ── Icon ───────────────────────────────────────────────────────── */}
        <fieldset className="txmodal-form__fieldset">
          <legend className="txmodal-form__legend">Icon</legend>
          <div className="sg-icon-picker" role="radiogroup" aria-label="Goal icon">
            {GOAL_ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                role="radio"
                aria-checked={form.icon === icon}
                aria-label={`Icon ${icon}`}
                className={['sg-icon-picker__item', form.icon === icon ? 'sg-icon-picker__item--active' : ''].filter(Boolean).join(' ')}
                onClick={() => set('icon', icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── Colour ─────────────────────────────────────────────────────── */}
        <fieldset className="txmodal-form__fieldset">
          <legend className="txmodal-form__legend">Colour</legend>
          <div className="sg-color-picker" role="radiogroup" aria-label="Goal colour">
            {GOAL_COLORS.map(color => (
              <button
                key={color}
                type="button"
                role="radio"
                aria-checked={form.color === color}
                aria-label={`Colour ${color}`}
                className={['sg-color-picker__item', form.color === color ? 'sg-color-picker__item--active' : ''].filter(Boolean).join(' ')}
                style={{ background: color }}
                onClick={() => set('color', color)}
              />
            ))}
          </div>
        </fieldset>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="txmodal-form__actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {isEdit ? 'Save changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SavingsGoalModal;
