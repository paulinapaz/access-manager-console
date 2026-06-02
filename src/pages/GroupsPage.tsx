import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
        subtitle="Sourced from your identity provider (SCIM) or from a product partition (e.g. a CertCentral Division). Assign access to a group and all its members inherit it."
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
                  <th>Assignments</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={5} title="No groups match" />
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
                              <div className="row-sub">
                                {g.source === 'Product'
                                  ? `Linked to ${g.origin?.product} ${g.origin?.kind} · also a scope`
                                  : g.externalId ?? ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {g.members && g.members.length > 0 ? (
                            <Link
                              className="count-link"
                              to={{ pathname: '/users', search: `?${new URLSearchParams({ group: g.id })}` }}
                            >
                              {g.memberCount} members
                            </Link>
                          ) : (
                            <span>{g.memberCount} members</span>
                          )}
                        </td>
                        <td>
                          {g.source === 'Product' ? (
                            <span className="pill product">
                              {g.origin?.product} {g.origin?.kind}
                            </span>
                          ) : (
                            <span className="pill type-IDP">SCIM / IDP</span>
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
                              { label: 'Add assignment', onClick: () => setAddingFor(g) },
                              ...(count > 0
                                ? [
                                    {
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
                                    },
                                  ]
                                : []),
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
