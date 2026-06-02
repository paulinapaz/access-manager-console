import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { PRODUCTS, SCOPES, PARTITION_KIND } from '@/data/products';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { EmptyRow } from '@/components/EmptyRow';
import type { ProductId } from '@/types';

const PRODUCT_ORDER = new Map<ProductId, number>(PRODUCTS.map((p, i) => [p.id, i]));

export function ScopesPage() {
  const assignments = useStore((s) => s.assignments);

  const [query, setQuery] = useState('');
  const [productFilter, setProductFilter] = useState<ProductId | ''>('');

  // assignment usage count per scope id
  const usageByScope = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assignments) {
      for (const sid of a.scopeIds) map.set(sid, (map.get(sid) ?? 0) + 1);
    }
    return map;
  }, [assignments]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SCOPES.filter((s) => {
      if (productFilter && s.product !== productFilter) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.kind.toLowerCase().includes(q);
    }).sort((a, b) => {
      // group by product, then partitions first, then by name
      const byProduct = (PRODUCT_ORDER.get(a.product) ?? 0) - (PRODUCT_ORDER.get(b.product) ?? 0);
      if (byProduct !== 0) return byProduct;
      const aPart = a.origin ? 0 : 1;
      const bPart = b.origin ? 0 : 1;
      if (aPart !== bPart) return aPart - bPart;
      return a.name.localeCompare(b.name);
    });
  }, [productFilter, query]);

  return (
    <>
      <PageHeader
        title="Scopes"
        subtitle="The resource boundaries access is granted over. Scopes are defined in each product and shown here read-only for assignment and audit. A scope whose kind is the product's partition (e.g. a Division, Team, or Business Unit) is also a principal group."
      />

      <section className="content">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <SearchInput value={query} onChange={setQuery} placeholder="Search scopes by name or kind..." />
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
            <div className="cell-muted">{filtered.length} of {SCOPES.length} scopes</div>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Product</th>
                  <th>Kind</th>
                  <th>Also a group</th>
                  <th>Assignments</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={5} title="No scopes match" description="Try a different search or filter." />
                ) : (
                  filtered.map((s) => {
                    const used = usageByScope.get(s.id) ?? 0;
                    const isPartition = Boolean(s.origin);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="cell-strong">{s.name}</div>
                          <div className="row-sub">
                            {isPartition
                              ? `${s.kind} — its resources (members targetable as a principal)`
                              : 'Resource scope'}
                          </div>
                        </td>
                        <td>{s.product}</td>
                        <td>
                          <span className="pill product">{s.kind}</span>
                        </td>
                        <td>
                          {isPartition ? (
                            <span
                              className="pill product"
                              title={`This ${s.kind} is also a principal group. Selecting it as a scope grants access to its resources; its members are targetable on the Principals step of an assignment.`}
                            >
                              {PARTITION_KIND[s.product] ?? s.kind} group
                            </span>
                          ) : (
                            <span className="count-zero">—</span>
                          )}
                        </td>
                        <td>
                          {used === 0 ? (
                            <span className="count-zero">0 assignments</span>
                          ) : (
                            <Link
                              className="count-link"
                              to={{ pathname: '/assignments', search: `?${new URLSearchParams({ scope: s.id })}` }}
                            >
                              {used} assignment{used === 1 ? '' : 's'}
                            </Link>
                          )}
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
    </>
  );
}
