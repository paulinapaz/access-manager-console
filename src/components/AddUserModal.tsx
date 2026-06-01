import { useState, type FormEvent } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { Drawer } from './Drawer';

interface AddUserModalProps {
  onClose: () => void;
}

export function AddUserModal({ onClose }: AddUserModalProps) {
  const users = useStore((s) => s.users);
  const addUser = useStore((s) => s.addUser);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [invite, setInvite] = useState(true);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dup = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === email.toLowerCase(),
    );
    if (dup) {
      toast('A user with that username or email already exists', 'error');
      return;
    }
    const u = addUser({
      username,
      name,
      email,
      type: 'Manual',
      status: invite ? 'Pending' : 'Active',
      lastActive: null,
    });
    toast(invite ? `Invitation sent to ${u.email}` : `Added ${u.name}`, 'success');
    onClose();
  }

  return (
    <Drawer
      title="Add user"
      onClose={onClose}
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" form="add-user-form">
            Add user
          </button>
        </div>
      }
    >
      <form id="add-user-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label-text">Full name</span>
          <input
            className="input"
            placeholder="e.g. Alex Rivera"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="label-text">Username</span>
          <input
            className="input"
            placeholder="e.g. arivera"
            required
            pattern="[a-zA-Z0-9._-]+"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="help">
            Letters, numbers, dots, dashes and underscores only.
          </div>
        </label>
        <label className="field">
          <span className="label-text">Email</span>
          <input
            className="input"
            type="email"
            placeholder="alex.rivera@acme.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={invite}
            onChange={(e) => setInvite(e.target.checked)}
          />
          Send invitation email so they can sign up
        </label>
      </form>
    </Drawer>
  );
}
