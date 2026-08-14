/**
 * RegisterPage — New account creation form.
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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
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
  email:           string;
  password:        string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?:        string;
  email?:           string;
  password?:        string;
  confirmPassword?: string;
  form?:            string;
}

// ─── Validation ─────────────────────────────────────────────────────────────────

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
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

  return errors;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const navigate      = useNavigate();
  const { register }  = useAuth();

  const [values, setValues]     = useState<FormState>({
    fullName: '', email: '', password: '', confirmPassword: '',
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
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    const clientErrors = validate(values);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSub(true);
    setErrors({});

    try {
      await register({ fullName: values.fullName.trim(), email: values.email.trim(), password: values.password });
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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

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
            Welcome, <strong>{values.fullName}</strong>!<br />
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

        {/* Email */}
        <div className="auth-form__field">
          <label htmlFor="reg-email" className="auth-form__label">Email</label>
          <div className={[
            'auth-form__input-wrap',
            fieldError('email') ? 'auth-form__input-wrap--error' : '',
          ].filter(Boolean).join(' ')}>
            <span className="auth-form__input-icon" aria-hidden="true"><MailIcon /></span>
            <input
              id="reg-email"
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
              aria-describedby={fieldError('email') ? 'reg-email-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {fieldError('email') && (
            <p id="reg-email-error" className="auth-form__field-error" role="alert">
              {fieldError('email')}
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
        Already have an account?{' '}
        <Link to="/login" className="auth-form__footer-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
