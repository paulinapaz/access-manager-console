import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
  size?: 'md' | 'lg';
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Right-side slide-over used for create/edit flows. Mirrors the Modal API
 * (title / onClose / size / children / footer) so callers swap in place.
 * `subtitle` renders under the title in the header — used for step indicators
 * in multi-step flows. Confirmation dialogs intentionally stay as centered modals.
 */
export function Drawer({ title, subtitle, onClose, size = 'md', children, footer }: DrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`sheet ${size === 'lg' ? 'lg' : ''}`} role="dialog" aria-modal="true">
        <div className="sheet-header">
          <div className="sheet-heading">
            <h2>{title}</h2>
            {subtitle ? <div className="sheet-subtitle">{subtitle}</div> : null}
          </div>
          <button className="sheet-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer ? <div className="sheet-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
