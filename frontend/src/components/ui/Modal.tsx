import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const Modal = ({ open, onClose, title, description, size = 'md', children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onClose]);

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus first focusable on open
  useEffect(() => {
    if (open) {
      const el = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        className={['modal', `modal--${size}`].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="modal__header">
            {title && <h2 id="modal-title" className="modal__title">{title}</h2>}
            {description && <p id="modal-desc" className="modal__desc">{description}</p>}
            <button className="modal__close" onClick={onClose} aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 4L4 14M4 4l10 10" />
              </svg>
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
