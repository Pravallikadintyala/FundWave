/**
 * LoginPage — Full authentication form.
 *
 * Fields:     Username, Password (show/hide), Remember Me
 * Actions:    Login button, Forgot Password link, Register link
 * Validation: Client-side (required, min length)
 * Errors:     Backend errors displayed inline
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

// ─── Form state ─────────────────────────────────────────────────────────────────

interface FormState {
  username:   string;
  password:   string;
  rememberMe: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
  form?:     string;
}

// ─── Validation ─────────────────────────────────────────────────────────────────

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  } else if (values.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [values, setValues]       = useState<FormState>({ username: '', password: '', rememberMe: false });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [showPassword, setShow]   = useState(false);
  const [isSubmitting, setSub]    = useState(false);
  const [touched, setTouched]     = useState<Partial<Record<keyof FormState, boolean>>>({});

  // ── Field change ──────────────────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValues = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(newValues);

    // Re-validate touched fields in real time
    if (touched[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, ...validate(newValues) }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, ...validate(values) }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Touch all fields to show all errors
    setTouched({ username: true, password: true });
    const clientErrors = validate(values);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSub(true);
    setErrors({});

    try {
      await login({ username: values.username.trim(), password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message  = axiosErr.response?.data?.message ?? 'Login failed. Please try again.';
      setErrors({ form: message });
    } finally {
      setSub(false);
    }
  };

  // ── Derived UI state ──────────────────────────────────────────────────────────
  const fieldError = (field: keyof FormErrors) =>
    touched[field as keyof FormState] ? errors[field] : undefined;

  return (
    <div className="auth-form-container" role="main">
      {/* Mobile logo — shown only on small screens */}
      <div className="auth-form__mobile-logo" aria-hidden="true">
        <LogoMark />
        <span className="auth-form__mobile-logo-name">FundWave</span>
      </div>

      {/* Heading */}
      <div className="auth-form__heading-group">
        <h1 className="auth-form__title">Welcome back</h1>
        <p className="auth-form__subtitle">
          Sign in to your FundWave account
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
        id="login-form"
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Login form"
      >
        {/* Username */}
        <div className="auth-form__field">
          <label htmlFor="login-username" className="auth-form__label">
            Username
          </label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('username') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true">
              <UserIcon />
            </span>
            <input
              id="login-username"
              name="username"
              type="text"
              className="auth-form__input"
              placeholder="your_username"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={values.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              aria-invalid={!!fieldError('username')}
              aria-describedby={fieldError('username') ? 'login-username-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {fieldError('username') && (
            <p id="login-username-error" className="auth-form__field-error" role="alert">
              {fieldError('username')}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="auth-form__field">
          <div className="auth-form__label-row">
            <label htmlFor="login-password" className="auth-form__label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="auth-form__forgot-link"
              tabIndex={0}
            >
              Forgot password?
            </Link>
          </div>
          <div className={[
            'auth-form__input-wrap',
            fieldError('password') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true">
              <LockIcon />
            </span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-form__input auth-form__input--with-action"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              aria-invalid={!!fieldError('password')}
              aria-describedby={fieldError('password') ? 'login-password-error' : undefined}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="auth-form__toggle-btn"
              onClick={() => setShow(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldError('password') && (
            <p id="login-password-error" className="auth-form__field-error" role="alert">
              {fieldError('password')}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="auth-form__checkbox-row">
          <label className="auth-form__checkbox-label" htmlFor="login-remember">
            <input
              id="login-remember"
              name="rememberMe"
              type="checkbox"
              className="auth-form__checkbox"
              checked={values.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <span className="auth-form__checkbox-custom" aria-hidden="true" />
            <span className="auth-form__checkbox-text">Remember me</span>
          </label>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          className="auth-form__submit-btn"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Signing in…</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="auth-form__footer-text">
        Don't have an account?{' '}
        <Link to="/register" className="auth-form__footer-link">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
