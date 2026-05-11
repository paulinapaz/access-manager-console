import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { confirmAction } from '@/store/useConfirm';
import { relTime } from '@/lib/format';
import { PlusIcon, RefreshIcon } from '@/lib/icons';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { StatusPill, SourcePill } from '@/components/Pill';
import { PrincipalIcon } from '@/components/PrincipalIcon';
import { AssignmentLink } from '@/components/AssignmentLink';
import { RowMenu } from '@/components/RowMenu';
import { EmptyRow } from '@/components/EmptyRow';
import { AddUserModal } from '@/components/AddUserModal';
import { EditUserModal } from '@/components/EditUserModal';
import type { User } from '@/types';

export function UsersPage() {
  const users = useStore((s) => s.users);
  const assignments = useStore((s) => s.assignments);
  const updateUser = useStore((s) => s.updateUser);
  const deleteUser = useStore((s) => s.deleteUser);
  const syncIdpUsers = useStore((s) => s.syncIdpUsers);

  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const assignmentCountById = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assignments) {
      if (a.principalType === 'user') {
        map.set(a.principalId, (map.get(a.principalId) ?? 0) + 1);
      }
    }
    return map;
  }, [assignments]);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  function handleSync() {
    const added = syncIdpUsers();
    if (added.length === 0) toast('Already in sync with IDP — no new users.', 'success');
    else toast(`Synced ${added.length} user${added.length === 1 ? '' : 's'} from IDP`, 'success');
  }

  function handleRevoke(u: User) {
    confirmAction({
      title: 'Revoke user access?',
      message: `${u.name} will lose access to all DigiCert products. Their assignments stay on file but become inactive.`,
      confirmText: 'Revoke access',
      danger: true,
      onConfirm: () => {
        updateUser(u.id, { status: 'Revoked' });
        toast(`Revoked ${u.name}`, 'success');
      },
    });
  }

  function handleDelete(u: User) {
    confirmAction({
      title: 'Delete user?',
      message: `This permanently removes ${u.name} and all their assignments. This action cannot be undone.`,
      confirmText: 'Delete user',
      danger: true,
      onConfirm: () => {
        deleteUser(u.id);
        toast(`Deleted ${u.name}`, 'success');
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="People in your organization who can access DigiCert products."
        actions={
          <>
            <button className="btn" onClick={handleSync}>
              <RefreshIcon /> Sync from IDP
            </button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <PlusIcon /> Add user
            </button>
          </>
        }
      />

      <section className="content">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search users by name, username or email..."
              />
            </div>
            <div className="cell-muted">
              {filtered.length} of {users.length} users
            </div>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Assignments</th>
                  <th>Last active</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={7} title="No users match" description="Try a different search." />
                ) : (
                  filtered.map((u) => {
                    const count = assignmentCountById.get(u.id) ?? 0;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="principal-cell">
                            <PrincipalIcon type="user" name={u.name} />
                            <div>
                              <div className="cell-strong">{u.name}</div>
                              <div className="row-sub">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td><SourcePill type={u.type} /></td>
                        <td><StatusPill status={u.status} /></td>
                        <td>
                          <AssignmentLink count={count} principalType="user" principalId={u.id} />
                        </td>
                        <td className="cell-muted">{relTime(u.lastActive)}</td>
                        <td className="actions-cell">
                          <RowMenu
                            items={[
                              { label: 'Edit user', onClick: () => setEditing(u) },
                              u.status !== 'Revoked'
                                ? { label: 'Revoke access', danger: true, onClick: () => handleRevoke(u) }
                                : {
                                    label: 'Reactivate user',
                                    onClick: () => {
                                      updateUser(u.id, { status: 'Active' });
                                      toast(`Reactivated ${u.name}`, 'success');
                                    },
                                  },
                              { label: 'Delete user', danger: true, onClick: () => handleDelete(u) },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} />}
      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
