import { create } from 'zustand';
import { uid } from '@/lib/format';

export type ToastKind = 'default' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, kind?: ToastKind) => void;
  dismiss: (id: string) => void;
}

const TOAST_TTL_MS = 2_800;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, kind = 'default') => {
    const t: Toast = { id: uid('t'), message, kind };
    set((s) => ({ toasts: [...s.toasts, t] }));
    setTimeout(() => get().dismiss(t.id), TOAST_TTL_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, kind: ToastKind = 'default') {
  useToast.getState().push(message, kind);
}
