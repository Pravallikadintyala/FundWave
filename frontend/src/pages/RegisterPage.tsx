/**
 * RegisterPage — New account creation form.
 *
 * Fields:     Full Name (display only), Username, Password (show/hide),
 *             Confirm Password, Accept Terms checkbox
 * Actions:    Register button, Login link
 * Validation: Client-side (required, match, min length)
 * Errors:     Backend errors displayed inline
 *
 * NOTE: The backend only stores `username` + `password`. Full Name is
 * collected on the frontend for a premium UX but is NOT sent to the API
 * (the current backend model has no `fullName` field). The username sent
 * is what the user types in the Username field.
 */

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="8" rx="2" />
    <path d="M5 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1L2 3.5v4c0 3 2.5 5.5 6 7 3.5-1.5 6-4 6-7v-4L8 1z" />
    <path d="M5.5 8l1.5 1.5 3-3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 8C2.5 4.5 5 3 8 3s5.5 1.5 7 5c-1.5 3.5-4 5-7 5S2.5 11.5 1 8z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 13.5L2.5 2.5M6.4 6.4A2 2 0 0 0 9.6 9.6" />
    <path d="M4.2 4.2C2.8 5.1 1.8 6.4 1 8c1.5 3.5 4 5 7 5a7 7 0 0 0 2.8-.6M7 3.1A7 7 0 0 1 8 3c3 0 5.5 1.5 7 5a9.8 9.8 0 0 1-1.8 2.8" />
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

// ─── Password strength ──────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak',   color: 'var(--color-danger)' };
  if (score === 2) return { score, label: 'Fair',   color: 'var(--color-warning)' };
  if (score === 3) return { score, label: 'Good',   color: 'var(--color-info)' };
  return            { score, label: 'Strong', color: 'var(--color-success)' };
}

// ─── Form state ─────────────────────────────────────────────────────────────────

interface FormState {
  fullName:        string;
  username:        string;
  password:        string;
  confirmPassword: string;
  acceptTerms:     boolean;
}

interface FormErrors {
  fullName?:        string;
  username?:        string;
  password?:        string;
  confirmPassword?: string;
  acceptTerms?:     string;
  form?:            string;
}

// ─── Validation ─────────────────────────────────────────────────────────────────

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  } else if (values.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(values.username.trim())) {
    errors.username = 'Username may only contain letters, numbers, _ . and -';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms to continue.';
  }

  return errors;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const navigate      = useNavigate();
  const { register }  = useAuth();

  const [values, setValues]     = useState<FormState>({
    fullName: '', username: '', password: '', confirmPassword: '', acceptTerms: false,
  });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [isSubmitting, setSub]  = useState(false);
  const [touched, setTouched]   = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [success, setSuccess]   = useState(false);

  const pwdStrength = getPasswordStrength(values.password);

  // ── Field change ──────────────────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValues = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(newValues);

    if (touched[name as keyof FormState]) {
      const errs = validate(newValues);
      setErrors(prev => ({ ...prev, [name]: errs[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate(values);
    setErrors(prev => ({ ...prev, [field]: errs[field] }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, username: true, password: true, confirmPassword: true, acceptTerms: true });
    const clientErrors = validate(values);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSub(true);
    setErrors({});

    try {
      await register({ username: values.username.trim(), password: values.password });
      setSuccess(true);
      // Redirect to login after 2 s with a success state hint
      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 2000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message  = axiosErr.response?.data?.message ?? 'Registration failed. Please try again.';
      setErrors({ form: message });
    } finally {
      setSub(false);
    }
  };

  const fieldError = (field: keyof FormState) =>
    touched[field] ? errors[field] : undefined;

  // ── Success state ─────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="auth-form-container auth-form-container--success" role="main" aria-live="polite">
        <div className="auth-success">
          <div className="auth-success__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="var(--color-success)" strokeWidth="2.5" fill="var(--color-success-muted)" />
              <path d="M14 24l7 7 13-14" stroke="var(--color-success)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="auth-success__title">Account created!</h2>
          <p className="auth-success__desc">
            Welcome, <strong>{values.username}</strong>!<br />
            Redirecting you to sign in…
          </p>
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

      {/* Heading */}
      <div className="auth-form__heading-group">
        <h1 className="auth-form__title">Create your account</h1>
        <p className="auth-form__subtitle">
          Start managing your finances smarter
        </p>
      </div>

      {/* Form-level error banner */}
      {errors.form && (
        <div className="auth-form__error-banner" role="alert" aria-live="polite">
          <span className="auth-form__error-banner-icon" aria-hidden="true">⚠</span>
          {errors.form}
        </div>
      )}

      <form
        id="register-form"
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Registration form"
      >
        {/* Full Name */}
        <div className="auth-form__field">
          <label htmlFor="reg-fullname" className="auth-form__label">Full Name</label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('fullName') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><UserIcon /></span>
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              className="auth-form__input"
              placeholder="Jane Smith"
              autoComplete="name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              aria-invalid={!!fieldError('fullName')}
              aria-describedby={fieldError('fullName') ? 'reg-fullname-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {fieldError('fullName') && (
            <p id="reg-fullname-error" className="auth-form__field-error" role="alert">
              {fieldError('fullName')}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="auth-form__field">
          <label htmlFor="reg-username" className="auth-form__label">Username</label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('username') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><UserIcon /></span>
            <input
              id="reg-username"
              name="username"
              type="text"
              className="auth-form__input"
              placeholder="jane_smith"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={values.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              aria-invalid={!!fieldError('username')}
              aria-describedby={fieldError('username') ? 'reg-username-error' : 'reg-username-hint'}
              disabled={isSubmitting}
            />
          </div>
          {fieldError('username') ? (
            <p id="reg-username-error" className="auth-form__field-error" role="alert">
              {fieldError('username')}
            </p>
          ) : (
            <p id="reg-username-hint" className="auth-form__field-hint">
              Letters, numbers, underscores, hyphens only.
            </p>
          )}
        </div>

        {/* Password */}
        <div className="auth-form__field">
          <label htmlFor="reg-password" className="auth-form__label">Password</label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('password') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><LockIcon /></span>
            <input
              id="reg-password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              className="auth-form__input auth-form__input--with-action"
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              aria-invalid={!!fieldError('password')}
              aria-describedby={fieldError('password') ? 'reg-password-error' : 'reg-password-strength'}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="auth-form__toggle-btn"
              onClick={() => setShowPwd(s => !s)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Password strength meter */}
          {values.password && !fieldError('password') && (
            <div id="reg-password-strength" className="auth-form__strength" aria-live="polite">
              <div className="auth-form__strength-bars">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="auth-form__strength-bar"
                    style={{ background: i <= pwdStrength.score ? pwdStrength.color : 'var(--color-border)' }}
                  />
                ))}
              </div>
              <span className="auth-form__strength-label" style={{ color: pwdStrength.color }}>
                {pwdStrength.label}
              </span>
            </div>
          )}

          {fieldError('password') && (
            <p id="reg-password-error" className="auth-form__field-error" role="alert">
              {fieldError('password')}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="auth-form__field">
          <label htmlFor="reg-confirm-password" className="auth-form__label">Confirm Password</label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('confirmPassword') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><ShieldIcon /></span>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type={showCPwd ? 'text' : 'password'}
              className="auth-form__input auth-form__input--with-action"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              aria-invalid={!!fieldError('confirmPassword')}
              aria-describedby={fieldError('confirmPassword') ? 'reg-confirm-error' : undefined}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="auth-form__toggle-btn"
              onClick={() => setShowCPwd(s => !s)}
              aria-label={showCPwd ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showCPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldError('confirmPassword') && (
            <p id="reg-confirm-error" className="auth-form__field-error" role="alert">
              {fieldError('confirmPassword')}
            </p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="auth-form__field">
          <label className="auth-form__checkbox-label" htmlFor="reg-terms">
            <input
              id="reg-terms"
              name="acceptTerms"
              type="checkbox"
              className="auth-form__checkbox"
              checked={values.acceptTerms}
              onChange={handleChange}
              onBlur={() => handleBlur('acceptTerms')}
              aria-invalid={!!fieldError('acceptTerms')}
              disabled={isSubmitting}
            />
            <span className="auth-form__checkbox-custom" aria-hidden="true" />
            <span className="auth-form__checkbox-text">
              I agree to the{' '}
              <Link to="/terms" className="auth-form__footer-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="auth-form__footer-link">Privacy Policy</Link>
            </span>
          </label>
          {fieldError('acceptTerms') && (
            <p className="auth-form__field-error" role="alert">
              {fieldError('acceptTerms')}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          className="auth-form__submit-btn"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Creating account…</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="auth-form__footer-text">
        Already have an account?{' '}
        <Link to="/login" className="auth-form__footer-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
