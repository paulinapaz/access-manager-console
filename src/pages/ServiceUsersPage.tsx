import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { confirmAction } from '@/store/useConfirm';
import { relTime } from '@/lib/format';
import { PlusIcon, RefreshIcon } from '@/lib/icons';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { SourcePill } from '@/components/Pill';
import { PrincipalIcon } from '@/components/PrincipalIcon';
import { AssignmentLink } from '@/components/AssignmentLink';
import { RowMenu } from '@/components/RowMenu';
import { EmptyRow } from '@/components/EmptyRow';
import { AddServiceUserModal } from '@/components/AddServiceUserModal';
import { EditServiceUserModal } from '@/components/EditServiceUserModal';
import type { ServiceUser } from '@/types';

export function ServiceUsersPage() {
  const serviceUsers = useStore((s) => s.serviceUsers);
  const assignments = useStore((s) => s.assignments);
  const updateServiceUser = useStore((s) => s.updateServiceUser);
  const deleteServiceUser = useStore((s) => s.deleteServiceUser);

  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ServiceUser | null>(null);

  const assignmentCountById = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assignments) {
      if (a.principalType === 'service_user') {
        map.set(a.principalId, (map.get(a.principalId) ?? 0) + 1);
      }
    }
    return map;
  }, [assignments]);

  const filtered = serviceUsers.filter((u) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.description ?? '').toLowerCase().includes(q)
    );
  });

  function handleDelete(u: ServiceUser) {
    confirmAction({
      title: 'Delete service user?',
      message: `Removes ${u.name} and all its assignments.`,
      confirmText: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteServiceUser(u.id);
        toast(`Deleted ${u.name}`, 'success');
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Service users"
        subtitle="Non-human accounts used by automation, scripts, and integrations."
        actions={
          <>
            <button className="btn" onClick={() => toast('No new service users in IDP', 'success')}>
              <RefreshIcon /> Sync from IDP
            </button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <PlusIcon /> Add service user
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
                placeholder="Search service users..."
              />
            </div>
            <div className="cell-muted">
              {filtered.length} of {serviceUsers.length} service users
            </div>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Service user</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Assignments</th>
                  <th>Last active</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={7} title="No service users match" />
                ) : (
                  filtered.map((u) => {
                    const count = assignmentCountById.get(u.id) ?? 0;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="principal-cell">
                            <PrincipalIcon type="service_user" name={u.name} />
                            <div>
                              <div className="cell-strong">{u.name}</div>
                              <div className="row-sub">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="cell-muted">{u.description || '—'}</td>
                        <td><SourcePill type={u.type} /></td>
                        <td>
                          <span className={`pill status-${u.status === 'Active' ? 'Active' : 'Revoked'}`}>
                            <span className="dot" />
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <AssignmentLink
                            count={count}
                            principalType="service_user"
                            principalId={u.id}
                          />
                        </td>
                        <td className="cell-muted">{relTime(u.lastActive)}</td>
                        <td className="actions-cell">
                          <RowMenu
                            items={[
                              { label: 'Edit service user', onClick: () => setEditing(u) },
                              u.status === 'Active'
                                ? {
                                    label: 'Revoke access',
                                    danger: true,
                                    onClick: () => {
                                      updateServiceUser(u.id, { status: 'Revoked' });
                                      toast(`Revoked ${u.name}`, 'success');
                                    },
                                  }
                                : {
                                    label: 'Reactivate',
                                    onClick: () => {
                                      updateServiceUser(u.id, { status: 'Active' });
                                      toast(`Reactivated ${u.name}`, 'success');
                                    },
                                  },
                              { label: 'Delete', danger: true, onClick: () => handleDelete(u) },
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

      {showAdd && <AddServiceUserModal onClose={() => setShowAdd(false)} />}
      {editing && <EditServiceUserModal serviceUser={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
