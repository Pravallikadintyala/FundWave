import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown = ({ trigger, items, align = 'right', className = '' }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className={['dropdown', className].filter(Boolean).join(' ')} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)} className="dropdown__trigger">
        {trigger}
      </div>
      {open && (
        <div
          className={['dropdown__menu', `dropdown__menu--${align}`].join(' ')}
          role="menu"
        >
          {items.map(item => {
            if (item.separator) return <div key={item.key} className="dropdown__separator" role="separator" />;
            return (
              <button
                key={item.key}
                role="menuitem"
                disabled={item.disabled}
                className={['dropdown__item', item.danger ? 'dropdown__item--danger' : ''].filter(Boolean).join(' ')}
                onClick={() => { item.onClick?.(); setOpen(false); }}
              >
                {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
