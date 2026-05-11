import { useState, type FormEvent } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import type { User, UserStatus } from '@/types';
import { Modal } from './Modal';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  const updateUser = useStore((s) => s.updateUser);
  const isIdp = user.type === 'IDP';
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState<UserStatus>(user.status);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateUser(
      user.id,
      isIdp
        ? { status }
        : { name, username, email, status },
    );
    toast(`Updated ${name}`, 'success');
    onClose();
  }

  return (
    <Modal
      title="Edit user"
      onClose={onClose}
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" form="edit-user-form">
            Save changes
          </button>
        </div>
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit}>
        {isIdp && (
          <div className="filter-banner" style={{ marginBottom: 14 }}>
            This user is synced from your identity provider. Profile fields are read-only.
          </div>
        )}
        <label className="field">
          <span className="label-text">Full name</span>
          <input
            className="input"
            value={name}
            disabled={isIdp}
            required={!isIdp}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Username</span>
          <input
            className="input"
            value={username}
            disabled={isIdp}
            required={!isIdp}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            disabled={isIdp}
            required={!isIdp}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Status</span>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Revoked">Revoked</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
