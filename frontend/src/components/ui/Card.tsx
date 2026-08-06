import { type HTMLAttributes, type ReactNode } from 'react';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'ghost';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

const Card = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className = '',
  ...rest
}: CardProps) => (
  <div
    className={[
      'card',
      `card--${variant}`,
      `card--pad-${padding}`,
      hover ? 'card--hover' : '',
      className,
    ].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={['card__header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={['card__body', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={['card__footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export default Card;
