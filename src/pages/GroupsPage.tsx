import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { confirmAction } from '@/store/useConfirm';
import { RefreshIcon } from '@/lib/icons';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { PrincipalIcon } from '@/components/PrincipalIcon';
import { AssignmentLink } from '@/components/AssignmentLink';
import { RowMenu } from '@/components/RowMenu';
import { EmptyRow } from '@/components/EmptyRow';
import { AddAssignmentModal } from '@/components/AddAssignmentModal';
import type { Group } from '@/types';

export function GroupsPage() {
  const groups = useStore((s) => s.groups);
  const assignments = useStore((s) => s.assignments);
  const deleteAssignmentsForPrincipal = useStore((s) => s.deleteAssignmentsForPrincipal);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [addingFor, setAddingFor] = useState<Group | null>(null);

  const assignmentCountById = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assignments) {
      if (a.principalType === 'group') {
        map.set(a.principalId, (map.get(a.principalId) ?? 0) + 1);
      }
    }
    return map;
  }, [assignments]);

  const filtered = groups.filter((g) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return g.name.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHeader
        title="Groups"
        subtitle="Synced from your identity provider via SCIM. Assign access to a group and all its members inherit it."
        actions={
          <button className="btn" onClick={() => toast('SCIM groups are up to date', 'success')}>
            <RefreshIcon /> Sync SCIM groups
          </button>
        }
      />

      <section className="content">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <SearchInput value={query} onChange={setQuery} placeholder="Search groups..." />
            </div>
            <div className="cell-muted">
              {filtered.length} of {groups.length} groups
            </div>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Members</th>
                  <th>Source</th>
                  <th>Access assigned</th>
                  <th>Assignments</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={6} title="No groups match" />
                ) : (
                  filtered.map((g) => {
                    const count = assignmentCountById.get(g.id) ?? 0;
                    return (
                      <tr key={g.id}>
                        <td>
                          <div className="principal-cell">
                            <PrincipalIcon type="group" name={g.name} />
                            <div>
                              <div className="cell-strong">{g.name}</div>
                              <div className="row-sub">{g.externalId ?? ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>{g.memberCount} members</td>
                        <td><span className="pill type-IDP">SCIM / IDP</span></td>
                        <td>
                          {count > 0 ? (
                            <span className="pill status-Active">
                              <span className="dot" />Yes
                            </span>
                          ) : (
                            <span className="pill status-Pending">
                              <span className="dot" />No access
                            </span>
                          )}
                        </td>
                        <td>
                          <AssignmentLink
                            count={count}
                            principalType="group"
                            principalId={g.id}
                          />
                        </td>
                        <td className="actions-cell">
                          <RowMenu
                            items={[
                              {
                                label: 'View members',
                                onClick: () =>
                                  toast('Member directory not implemented in this mock', 'success'),
                              },
                              {
                                label: 'Manage assignments',
                                onClick: () =>
                                  navigate({
                                    pathname: '/assignments',
                                    search: `?principal=group:${g.id}`,
                                  }),
                              },
                              count > 0
                                ? {
                                    label: 'Revoke all access',
                                    danger: true,
                                    onClick: () =>
                                      confirmAction({
                                        title: 'Revoke all access?',
                                        message: `This removes all ${count} assignment(s) for ${g.name}.`,
                                        confirmText: 'Revoke all',
                                        danger: true,
                                        onConfirm: () => {
                                          deleteAssignmentsForPrincipal('group', g.id);
                                          toast(`Revoked all access for ${g.name}`, 'success');
                                        },
                                      }),
                                  }
                                : {
                                    label: 'Add assignment',
                                    onClick: () => setAddingFor(g),
                                  },
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

      {addingFor && (
        <AddAssignmentModal
          onClose={() => setAddingFor(null)}
          initialPrincipal={{ type: 'group', id: addingFor.id }}
        />
      )}
    </>
  );
}
