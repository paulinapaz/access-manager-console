import { useEffect, useRef, useState } from 'react';
import { MoreIcon } from '@/lib/icons';

export interface RowMenuItem {
  label: string;
  danger?: boolean;
  onClick: () => void;
}

interface RowMenuProps {
  items: RowMenuItem[];
}

export function RowMenu({ items }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="menu-wrap" ref={wrapRef}>
      <button
        className="btn-icon"
        title="More"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreIcon />
      </button>
      {open && (
        <div className="menu">
          {items.map((it, i) => (
            <button
              key={i}
              className={it.danger ? 'danger' : ''}
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
