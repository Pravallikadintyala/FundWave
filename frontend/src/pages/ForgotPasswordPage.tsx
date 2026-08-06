/**
 * ForgotPasswordPage — UI only.
 *
 * Displays a professional "request password reset" form.
 * No backend integration (the backend does not implement this endpoint).
 * After submitting, shows a confirmation message to the user.
 */

import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="14" height="10" rx="2" />
    <path d="M1 5l7 5 7-5" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2L4 7.5 9 13" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round"
    style={{ animation: 'spin 0.7s linear infinite' }}>
    <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" opacity="0.3" />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
);

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Component ──────────────────────────────────────────────────────────────────

const ForgotPasswordPage = () => {
  const [email, setEmail]         = useState('');
  const [emailError, setErr]      = useState('');
  const [isSubmitting, setSub]    = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched]     = useState(false);

  const validateEmail = (val: string) => {
    if (!val.trim())                    return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
    return '';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched) setErr(validateEmail(e.target.value));
  };

  const handleBlur = () => {
    setTouched(true);
    setErr(validateEmail(email));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    if (err) { setErr(err); return; }

    setSub(true);
    // Simulate async — no real backend endpoint
    await new Promise(r => setTimeout(r, 1200));
    setSub(false);
    setSubmitted(true);
  };

  // ── Success state ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="auth-form-container" role="main" aria-live="polite">
        <div className="auth-success">
          <div className="auth-success__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="var(--color-primary)" strokeWidth="2.5"
                fill="var(--color-primary-muted)" />
              <rect x="13" y="17" width="22" height="15" rx="3"
                stroke="var(--color-primary)" strokeWidth="2" fill="none" />
              <path d="M13 21l11 7 11-7" stroke="var(--color-primary)" strokeWidth="2"
                strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="auth-success__title">Check your inbox</h2>
          <p className="auth-success__desc">
            If <strong>{email}</strong> is linked to a FundWave account,
            you'll receive a password-reset link shortly.
          </p>
          <Link to="/login" className="auth-form__submit-btn auth-form__submit-btn--link">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container" role="main">
      {/* Mobile logo */}
      <div className="auth-form__mobile-logo" aria-hidden="true">
        <LogoMark />
        <span className="auth-form__mobile-logo-name">FundWave</span>
      </div>

      {/* Back link */}
      <Link to="/login" className="auth-form__back-link" aria-label="Back to sign in">
        <ArrowLeftIcon />
        <span>Back to sign in</span>
      </Link>

      {/* Heading */}
      <div className="auth-form__heading-group">
        <h1 className="auth-form__title">Reset your password</h1>
        <p className="auth-form__subtitle">
          Enter the email linked to your account and we'll send a reset link.
        </p>
      </div>

      <form
        id="forgot-password-form"
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Forgot password form"
      >
        {/* Email */}
        <div className="auth-form__field">
          <label htmlFor="forgot-email" className="auth-form__label">Email address</label>
          <div className={[
            'auth-form__input-wrap',
            touched && emailError ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><MailIcon /></span>
            <input
              id="forgot-email"
              name="email"
              type="email"
              className="auth-form__input"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched && !!emailError}
              aria-describedby={touched && emailError ? 'forgot-email-error' : 'forgot-email-hint'}
              disabled={isSubmitting}
            />
          </div>
          {touched && emailError ? (
            <p id="forgot-email-error" className="auth-form__field-error" role="alert">
              {emailError}
            </p>
          ) : (
            <p id="forgot-email-hint" className="auth-form__field-hint">
              We'll only send a reset link if your email exists in our system.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="forgot-password-submit"
          type="submit"
          className="auth-form__submit-btn"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Sending reset link…</span>
            </>
          ) : (
            <span>Send reset link</span>
          )}
        </button>
      </form>

      <p className="auth-form__footer-text">
        Remember your password?{' '}
        <Link to="/login" className="auth-form__footer-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
