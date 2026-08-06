import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, iconLeft, iconRight, inputSize = 'md',
     id, className = '', ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className={[
          'input-field-wrap',
          iconLeft  ? 'input-field-wrap--icon-left'  : '',
          iconRight ? 'input-field-wrap--icon-right' : '',
          hasError  ? 'input-field-wrap--error'      : '',
        ].filter(Boolean).join(' ')}>
          {iconLeft  && <span className="input-icon input-icon--left">{iconLeft}</span>}
          <input
            ref={ref}
            id={inputId}
            className={[
              'input-field',
              `input-field--${inputSize}`,
              hasError ? 'input-field--error' : '',
              className,
            ].filter(Boolean).join(' ')}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...rest}
          />
          {iconRight && <span className="input-icon input-icon--right">{iconRight}</span>}
        </div>
        {hasError && (
          <p id={`${inputId}-error`} className="input-error" role="alert">{error}</p>
        )}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="input-helper">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
