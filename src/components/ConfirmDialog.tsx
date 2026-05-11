import { useConfirm } from '@/store/useConfirm';
import { Modal } from './Modal';

export function ConfirmDialog() {
  const { request, close } = useConfirm();
  if (!request) return null;

  const handleConfirm = () => {
    request.onConfirm();
    close();
  };

  return (
    <Modal
      title={request.title}
      onClose={close}
      footer={
        <div className="flex gap-8">
          <button className="btn" onClick={close}>
            Cancel
          </button>
          <button
            className={`btn ${request.danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {request.confirmText ?? 'Confirm'}
          </button>
        </div>
      }
    >
      <p style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>{request.message}</p>
    </Modal>
  );
}
