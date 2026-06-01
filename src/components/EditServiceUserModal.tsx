import { useState, type FormEvent } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import type { ServiceUser, ServiceUserStatus } from '@/types';
import { Drawer } from './Drawer';

interface EditServiceUserModalProps {
  serviceUser: ServiceUser;
  onClose: () => void;
}

export function EditServiceUserModal({ serviceUser, onClose }: EditServiceUserModalProps) {
  const updateServiceUser = useStore((s) => s.updateServiceUser);
  const [name, setName] = useState(serviceUser.name);
  const [username, setUsername] = useState(serviceUser.username);
  const [description, setDescription] = useState(serviceUser.description ?? '');
  const [status, setStatus] = useState<ServiceUserStatus>(serviceUser.status);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateServiceUser(serviceUser.id, { name, username, description, status });
    toast(`Updated ${name}`, 'success');
    onClose();
  }

  return (
    <Drawer
      title="Edit service user"
      onClose={onClose}
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" form="edit-su-form">
            Save changes
          </button>
        </div>
      }
    >
      <form id="edit-su-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label-text">Service user name</span>
          <input
            className="input"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Username</span>
          <input
            className="input"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Description</span>
          <textarea
            className="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Status</span>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as ServiceUserStatus)}
          >
            <option value="Active">Active</option>
            <option value="Revoked">Revoked</option>
          </select>
        </label>
      </form>
    </Drawer>
  );
}
