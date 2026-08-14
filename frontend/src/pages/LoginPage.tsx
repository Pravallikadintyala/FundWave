/**
 * LoginPage — Full authentication form.
 */

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12M2 4l6 4.5L14 4M2 4v8h12V4" />
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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

// ─── Form state ─────────────────────────────────────────────────────────────────

interface FormState {
  email:      string;
  password:   string;
  rememberMe: boolean;
}

interface FormErrors {
  email?:    string;
  password?: string;
  form?:     string;
}

// ─── Validation ─────────────────────────────────────────────────────────────────

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const [searchParams] = useSearchParams();

  // Show OAuth error if redirected back from a failed Google sign-in
  const oauthError  = searchParams.get('error') === 'oauth_failed';
  const oauthReason = searchParams.get('reason');

  const [values, setValues]       = useState<FormState>({ email: '', password: '', rememberMe: false });
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

    setTouched({ email: true, password: true });
    const clientErrors = validate(values);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSub(true);
    setErrors({});

    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message  = axiosErr.response?.data?.message ?? 'Login failed. Please try again.';
      setErrors({ form: message });
    } finally {
      setSub(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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

      {/* OAuth error banner — shown when redirected from a failed Google sign-in */}
      {oauthError && (
        <div className="auth-form__error-banner" role="alert" aria-live="polite">
          <span className="auth-form__error-banner-icon" aria-hidden="true">⚠</span>
          <span>
            Google sign-in failed.{oauthReason ? ` Reason: ${oauthReason}` : ' Please try again or check the backend terminal for details.'}
          </span>
        </div>
      )}

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
        {/* Email */}
        <div className="auth-form__field">
          <label htmlFor="login-email" className="auth-form__label">
            Email
          </label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('email') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true">
              <MailIcon />
            </span>
            <input
              id="login-email"
              name="email"
              type="email"
              className="auth-form__input"
              placeholder="name@example.com"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={values.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              aria-invalid={!!fieldError('email')}
              aria-describedby={fieldError('email') ? 'login-email-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {fieldError('email') && (
            <p id="login-email-error" className="auth-form__field-error" role="alert">
              {fieldError('email')}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="auth-form__field">
          <div className="auth-form__label-row">
            <label htmlFor="login-password" className="auth-form__label">
              Password
            </label>
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

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        <span style={{ margin: '0 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
      </div>

      <button
        type="button"
        className="auth-form__submit-btn"
        style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB' }}
        onClick={handleGoogleLogin}
      >
        <GoogleIcon />
        <span style={{ marginLeft: '0.5rem' }}>Continue with Google</span>
      </button>

      {/* Footer link */}
      <p className="auth-form__footer-text" style={{ marginTop: '1.5rem' }}>
        Don't have an account?{' '}
        <Link to="/register" className="auth-form__footer-link">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
