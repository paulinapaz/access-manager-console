import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { confirmAction } from '@/store/useConfirm';
import { PRODUCTS } from '@/data/products';
import { PlusIcon } from '@/lib/icons';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { RowMenu } from '@/components/RowMenu';
import { EmptyRow } from '@/components/EmptyRow';
import { AddRoleModal } from '@/components/AddRoleModal';
import { EditRoleModal } from '@/components/EditRoleModal';
import type { ProductId, Role, RoleType } from '@/types';

export function RolesPage() {
  const roles = useStore((s) => s.roles);
  const assignments = useStore((s) => s.assignments);
  const deleteRole = useStore((s) => s.deleteRole);

  const [query, setQuery] = useState('');
  const [productFilter, setProductFilter] = useState<ProductId | ''>('');
  const [typeFilter, setTypeFilter] = useState<RoleType | ''>('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  // assignment usage count per role id
  const usageById = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assignments) {
      for (const rid of a.roleIds) map.set(rid, (map.get(rid) ?? 0) + 1);
    }
    return map;
  }, [assignments]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return roles.filter((r) => {
      if (productFilter && r.product !== productFilter) return false;
      if (typeFilter && r.type !== typeFilter) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    });
  }, [roles, productFilter, typeFilter, query]);

  function handleDelete(r: Role) {
    const used = usageById.get(r.id) ?? 0;
    confirmAction({
      title: 'Delete custom role?',
      message:
        used > 0
          ? `"${r.name}" is used by ${used} assignment${used === 1 ? '' : 's'}. Deleting it removes the role from those assignments.`
          : `This permanently deletes the custom role "${r.name}".`,
      confirmText: 'Delete role',
      danger: true,
      onConfirm: () => {
        deleteRole(r.id);
        toast(`Deleted "${r.name}"`, 'success');
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="A role is a product-scoped container of capabilities. Built-in roles are managed by DigiCert; create custom roles to tailor access."
        actions={
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <PlusIcon /> Create custom role
          </button>
        }
      />

      <section className="content">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <SearchInput value={query} onChange={setQuery} placeholder="Search roles by name or description..." />
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
              <select
                className="select"
                style={{ width: 'auto' }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as RoleType | '')}
              >
                <option value="">All types</option>
                <option value="Built-in">Built-in</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="cell-muted">{filtered.length} of {roles.length} roles</div>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Capabilities</th>
                  <th>Used by</th>
                  <th className="actions-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={6} title="No roles match" description="Try a different search or filter." />
                ) : (
                  filtered.map((r) => {
                    const used = usageById.get(r.id) ?? 0;
                    const isBuiltIn = r.type === 'Built-in';
                    return (
                      <tr key={r.id}>
                        <td>
                          <div className="cell-strong">{r.name}</div>
                          <div className="row-sub">{r.description}</div>
                        </td>
                        <td>{r.product}</td>
                        <td>
                          <span className={`pill role-${r.type}`}>{r.type}</span>
                        </td>
                        <td>{r.capabilities.length}</td>
                        <td>
                          {used === 0 ? (
                            <span className="count-zero">0 assignments</span>
                          ) : (
                            <Link
                              className="count-link"
                              to={{ pathname: '/assignments', search: `?${new URLSearchParams({ role: r.id })}` }}
                            >
                              {used} assignment{used === 1 ? '' : 's'}
                            </Link>
                          )}
                        </td>
                        <td className="actions-cell">
                          <RowMenu
                            items={
                              isBuiltIn
                                ? [{ label: 'View details', onClick: () => setEditing(r) }]
                                : [
                                    { label: 'Edit role', onClick: () => setEditing(r) },
                                    { label: 'Delete role', danger: true, onClick: () => handleDelete(r) },
                                  ]
                            }
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

      {showAdd && <AddRoleModal onClose={() => setShowAdd(false)} />}
      {editing && <EditRoleModal role={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
