import { create } from 'zustand';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
}

interface ConfirmState {
  request: ConfirmRequest | null;
  open: (req: ConfirmRequest) => void;
  close: () => void;
}

export const useConfirm = create<ConfirmState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

export function confirmAction(req: ConfirmRequest) {
  useConfirm.getState().open(req);
}
