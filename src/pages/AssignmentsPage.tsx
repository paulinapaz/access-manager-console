import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { confirmAction } from '@/store/useConfirm';
import { dateOnly } from '@/lib/format';
import {
  getPrincipal,
  principalLabel,
  principalSubLabel,
  principalTypeLabel,
} from '@/lib/lookups';
import { PRODUCTS, SCOPES } from '@/data/products';
import { PlusIcon } from '@/lib/icons';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { PrincipalIcon } from '@/components/PrincipalIcon';
import { RowMenu } from '@/components/RowMenu';
import { EmptyRow } from '@/components/EmptyRow';
import { AddAssignmentModal } from '@/components/AddAssignmentModal';
import { EditAssignmentModal } from '@/components/EditAssignmentModal';
import type { Assignment, PrincipalRef, ProductId, Scope } from '@/types';

function parsePrincipalParam(raw: string | null): PrincipalRef | null {
  if (!raw) return null;
  const [type, id] = raw.split(':');
  if (!type || !id) return null;
  if (type !== 'user' && type !== 'service_user' && type !== 'group') return null;
  return { type, id };
}

const SCOPE_BY_ID = new Map<string, Scope>(SCOPES.map((s) => [s.id, s]));

export function AssignmentsPage() {
  const assignments = useStore((s) => s.assignments);
  const users = useStore((s) => s.users);
  const serviceUsers = useStore((s) => s.serviceUsers);
  const groups = useStore((s) => s.groups);
  const deleteAssignment = useStore((s) => s.deleteAssignment);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = parsePrincipalParam(searchParams.get('principal'));

  const [query, setQuery] = useState('');
  const [productFilter, setProductFilter] = useState<ProductId | ''>('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const filtered = useMemo(() => {
    let rows = assignments.slice();
    if (filter) {
      rows = rows.filter(
        (a) => a.principalType === filter.type && a.principalId === filter.id,
      );
    }
    if (productFilter) {
      rows = rows.filter((a) => a.product === productFilter);
    }
    const q = query.toLowerCase().trim();
    if (q) {
      rows = rows.filter((a) => {
        const p = getPrincipal(a.principalType, a.principalId, users, serviceUsers, groups);
        const pName = p ? principalLabel(a.principalType, p).toLowerCase() : '';
        const scopeNames = a.scopeIds
          .map((id) => SCOPE_BY_ID.get(id)?.name ?? '')
          .join(' ')
          .toLowerCase();
        return (
          pName.includes(q) ||
          a.product.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          scopeNames.includes(q)
        );
      });
    }
    rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return rows;
  }, [assignments, filter, productFilter, query, users, serviceUsers, groups]);

  const filterPrincipal = filter
    ? getPrincipal(filter.type, filter.id, users, serviceUsers, groups)
    : null;
  const filterLabel = filter ? principalLabel(filter.type, filterPrincipal) : '';

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="Each assignment grants a principal a role on a product, scoped to specific resources."
        actions={
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <PlusIcon /> Add assignment
          </button>
        }
      />

      <section className="content">
        {filter && (
          <div className="filter-banner">
            <strong style={{ fontWeight: 600 }}>Filtered:</strong>
            {principalTypeLabel(filter.type)} = <strong>{filterLabel || 'Unknown'}</strong>
            <button onClick={() => navigate('/assignments')}>Clear filter</button>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search by principal, product, role or scope..."
              />
              <select
                className="select"
                style={{ width: 'auto' }}
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value as ProductId | '')}
              >
                <option value="">All products</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="cell-muted">
              {filtered.length} of {assignments.length} assignments
            </div>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Principal</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Role</th>
                  <th>Scopes</th>
                  <th>Created</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow
                    colSpan={7}
                    title="No assignments yet"
                    description={
                      <>
                        Click <strong>Add assignment</strong> to grant access.
                      </>
                    }
                  />
                ) : (
                  filtered.map((a) => (
                    <AssignmentRow
                      key={a.id}
                      assignment={a}
                      onEdit={() => setEditing(a)}
                      onDelete={() => {
                        const p = getPrincipal(a.principalType, a.principalId, users, serviceUsers, groups);
                        const pLabel = principalLabel(a.principalType, p);
                        confirmAction({
                          title: 'Delete assignment?',
                          message: `Revokes "${a.role}" on ${a.product} for ${pLabel}.`,
                          confirmText: 'Delete',
                          danger: true,
                          onConfirm: () => {
                            deleteAssignment(a.id);
                            toast('Assignment deleted', 'success');
                          },
                        });
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showAdd && (
        <AddAssignmentModal
          onClose={() => setShowAdd(false)}
          initialPrincipal={filter}
        />
      )}
      {editing && (
        <EditAssignmentModal assignment={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

interface AssignmentRowProps {
  assignment: Assignment;
  onEdit: () => void;
  onDelete: () => void;
}

function AssignmentRow({ assignment: a, onEdit, onDelete }: AssignmentRowProps) {
  const users = useStore((s) => s.users);
  const serviceUsers = useStore((s) => s.serviceUsers);
  const groups = useStore((s) => s.groups);
  const principal = getPrincipal(a.principalType, a.principalId, users, serviceUsers, groups);
  const pLabel = principalLabel(a.principalType, principal);
  const subLine = principalSubLabel(a.principalType, principal);

  return (
    <tr>
      <td>
        <div className="principal-cell">
          <PrincipalIcon type={a.principalType} name={pLabel} />
          <div>
            <div className="cell-strong">{pLabel}</div>
            <div className="row-sub">{subLine}</div>
          </div>
        </div>
      </td>
      <td>{principalTypeLabel(a.principalType)}</td>
      <td><span className="pill product">{a.product}</span></td>
      <td>{a.role}</td>
      <td>
        {a.scopeIds.map((id) => {
          const s = SCOPE_BY_ID.get(id);
          return (
            <span className="scope-tag" key={id} title={s?.kind ?? ''}>
              {s?.name ?? 'Unknown'}
            </span>
          );
        })}
      </td>
      <td className="cell-muted">{dateOnly(a.createdAt)}</td>
      <td className="actions-cell">
        <RowMenu
          items={[
            { label: 'Edit assignment', onClick: onEdit },
            { label: 'Delete assignment', danger: true, onClick: onDelete },
          ]}
        />
      </td>
    </tr>
  );
}
