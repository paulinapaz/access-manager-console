import { createPortal } from 'react-dom';
import { useToast } from '@/store/useToast';

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  if (toasts.length === 0) return null;
  return createPortal(
    <div id="toast-root">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === 'default' ? '' : t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>,
    document.body,
  );
}
