import { useState, type FormEvent } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { Modal } from './Modal';

interface AddServiceUserModalProps {
  onClose: () => void;
}

export function AddServiceUserModal({ onClose }: AddServiceUserModalProps) {
  const addServiceUser = useStore((s) => s.addServiceUser);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addServiceUser({
      name,
      username,
      description,
      status: 'Active',
      type: 'Manual',
      lastActive: null,
    });
    toast(`Added ${name}`, 'success');
    onClose();
  }

  return (
    <Modal
      title="Add service user"
      onClose={onClose}
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" form="add-su-form">
            Add service user
          </button>
        </div>
      }
    >
      <form id="add-su-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label-text">Service user name</span>
          <input
            className="input"
            placeholder="e.g. Release Pipeline"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Username</span>
          <input
            className="input"
            placeholder="e.g. release-pipeline"
            required
            pattern="[a-zA-Z0-9._-]+"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Description</span>
          <textarea
            className="textarea"
            rows={3}
            placeholder="What this service account is used for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </form>
    </Modal>
  );
}
