/**
 * TransactionModal — premium Add / Edit modal.
 *
 * Reused for both creating and editing a transaction.
 * Pre-fills values when `editingTx` is provided.
 *
 * Fields: Type → Category → Amount → Description → Date → Notes
 * Validation: all required fields with helpful inline messages.
 */

import { useEffect, useId, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getCurrencySymbol } from '@/utils/format';
import type { Transaction, Category } from '@/types';
import type { CreateTransactionPayload, UpdateTransactionPayload } from '@/services/transactionService';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const IncomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 14V4M4 9l5-5 5 5" />
  </svg>
);

const ExpenseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4v10M4 9l5 5 5-5" />
  </svg>
);

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  type:            'Income' | 'Expense';
  categoryId:      string;
  amount:          string;
  description:     string;
  transactionDate: string;
  notes:           string;
}

interface FormErrors {
  categoryId?:      string;
  amount?:          string;
  transactionDate?: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const initForm = (tx?: Transaction | null): FormState => ({
  type:            tx?.type            ?? 'Expense',
  categoryId:      typeof tx?.category === 'string'
                     ? tx.category
                     : (tx?.category as Category | undefined)?.id ?? '',
  amount:          tx?.amount != null ? String(tx.amount) : '',
  description:     tx?.description    ?? '',
  transactionDate: tx?.transactionDate ? tx.transactionDate.slice(0, 10) : todayISO(),
  notes:           '',
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface TransactionModalProps {
  open:        boolean;
  onClose:     () => void;
  editingTx?:  Transaction | null;
  categories:  Category[];
  onSubmit:    (payload: CreateTransactionPayload | UpdateTransactionPayload) => Promise<boolean>;
  isEdit:      boolean;
}

const TransactionModal = ({
  open,
  onClose,
  editingTx,
  categories,
  onSubmit,
  isEdit,
}: TransactionModalProps) => {
  const [form, setForm]         = useState<FormState>(initForm(editingTx));
  const [errors, setErrors]     = useState<FormErrors>({});
  const [submitting, setSubmit] = useState(false);
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency);
  const amountRef               = useRef<HTMLInputElement>(null);

  const amountId   = useId();
  const descId     = useId();
  const dateId     = useId();
  const notesId    = useId();
  const catId      = useId();

  // Reset form when modal opens / editing tx changes
  useEffect(() => {
    if (open) {
      setForm(initForm(editingTx));
      setErrors({});
      setSubmit(false);
    }
  }, [open, editingTx]);

  const filteredCategories = categories.filter(c => c.type === form.type);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key === 'categoryId' ? 'categoryId' : key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.categoryId)      errs.categoryId      = 'Please select a category';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
                               errs.amount          = 'Enter a valid positive amount';
    if (!form.transactionDate) errs.transactionDate = 'Please select a date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmit(true);
    const payload = {
      type:            form.type,
      category:        form.categoryId,
      amount:          Number(form.amount),
      description:     form.description.trim() || undefined,
      transactionDate: form.transactionDate,
    };

    const ok = await onSubmit(payload);
    setSubmit(false);
    if (ok) onClose();
  };

  const handleTypeChange = (t: 'Income' | 'Expense') => {
    setForm(prev => ({ ...prev, type: t, categoryId: '' }));
    setErrors(prev => ({ ...prev, categoryId: undefined }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
      description={isEdit ? 'Update the transaction details below.' : 'Record a new income or expense entry.'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="txmodal-form" noValidate>
        {/* ── Type selector ─────────────────────────────────────────────── */}
        <fieldset className="txmodal-form__fieldset">
          <legend className="txmodal-form__legend">Transaction type</legend>
          <div className="txmodal-type-group" role="group">
            {(['Income', 'Expense'] as const).map(t => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={form.type === t}
                className={[
                  'txmodal-type-btn',
                  `txmodal-type-btn--${t.toLowerCase()}`,
                  form.type === t ? 'txmodal-type-btn--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleTypeChange(t)}
              >
                <span className="txmodal-type-btn__icon">
                  {t === 'Income' ? <IncomeIcon /> : <ExpenseIcon />}
                </span>
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── Grid: Category + Amount ───────────────────────────────────── */}
        <div className="txmodal-form__grid">
          {/* Category */}
          <div className="txmodal-form__field">
            <label htmlFor={catId} className="txmodal-form__label">
              Category <span aria-hidden="true">*</span>
            </label>
            <select
              id={catId}
              className={['txmodal-form__select', errors.categoryId ? 'txmodal-form__select--error' : ''].filter(Boolean).join(' ')}
              value={form.categoryId}
              onChange={e => set('categoryId', e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={errors.categoryId ? `${catId}-err` : undefined}
            >
              <option value="">Select category…</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}{c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p id={`${catId}-err`} className="txmodal-form__error" role="alert">{errors.categoryId}</p>
            )}
          </div>

          {/* Amount */}
          <div className="txmodal-form__field">
            <label htmlFor={amountId} className="txmodal-form__label">
              Amount <span aria-hidden="true">*</span>
            </label>
            <div className="txmodal-form__amount-wrap">
              <span className="txmodal-form__currency" aria-hidden="true">{currencySymbol}</span>
              <input
                ref={amountRef}
                id={amountId}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className={['txmodal-form__input txmodal-form__input--amount', errors.amount ? 'txmodal-form__input--error' : ''].filter(Boolean).join(' ')}
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? `${amountId}-err` : undefined}
              />
            </div>
            {errors.amount && (
              <p id={`${amountId}-err`} className="txmodal-form__error" role="alert">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* ── Description ───────────────────────────────────────────────── */}
        <div className="txmodal-form__field">
          <label htmlFor={descId} className="txmodal-form__label">Description</label>
          <input
            id={descId}
            type="text"
            maxLength={200}
            placeholder="e.g. Monthly groceries…"
            className="txmodal-form__input"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* ── Date ──────────────────────────────────────────────────────── */}
        <div className="txmodal-form__field">
          <label htmlFor={dateId} className="txmodal-form__label">
            Date <span aria-hidden="true">*</span>
          </label>
          <input
            id={dateId}
            type="date"
            className={['txmodal-form__input', errors.transactionDate ? 'txmodal-form__input--error' : ''].filter(Boolean).join(' ')}
            value={form.transactionDate}
            onChange={e => set('transactionDate', e.target.value)}
            max={todayISO()}
            aria-required="true"
            aria-invalid={Boolean(errors.transactionDate)}
            aria-describedby={errors.transactionDate ? `${dateId}-err` : undefined}
          />
          {errors.transactionDate && (
            <p id={`${dateId}-err`} className="txmodal-form__error" role="alert">{errors.transactionDate}</p>
          )}
        </div>

        {/* ── Notes ────────────────────────────────────────────────────── */}
        <div className="txmodal-form__field">
          <label htmlFor={notesId} className="txmodal-form__label">
            Notes <span className="txmodal-form__optional">(optional)</span>
          </label>
          <textarea
            id={notesId}
            placeholder="Any additional context…"
            className="txmodal-form__textarea"
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="txmodal-form__actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {isEdit ? 'Save changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
