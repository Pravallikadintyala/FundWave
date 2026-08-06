import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'btn--primary',
  secondary: 'btn--secondary',
  ghost:     'btn--ghost',
  danger:    'btn--danger',
  outline:   'btn--outline',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, iconLeft, iconRight,
     fullWidth = false, disabled, children, className = '', ...rest }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'btn',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? 'btn--full' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...rest}
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          iconLeft && <span className="btn__icon">{iconLeft}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && <span className="btn__icon">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
