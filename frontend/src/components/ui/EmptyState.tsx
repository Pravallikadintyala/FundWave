import type { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className = '' }: EmptyStateProps) => (
  <div className={['empty-state', className].filter(Boolean).join(' ')}>
    {icon && <div className="empty-state__icon" aria-hidden="true">{icon}</div>}
    <p className="empty-state__title">{title}</p>
    {description && <p className="empty-state__desc">{description}</p>}
    {action && (
      <Button variant="primary" size="sm" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

export default EmptyState;
