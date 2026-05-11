import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { PRODUCTS, ROLES_BY_PRODUCT, SCOPES } from '@/data/products';
import type { PrincipalRef, ProductId } from '@/types';
import { Modal } from './Modal';
import { PrincipalPicker } from './PrincipalPicker';
import { ScopePicker } from './ScopePicker';

interface AddAssignmentModalProps {
  onClose: () => void;
  initialPrincipal?: PrincipalRef | null;
}

export function AddAssignmentModal({ onClose, initialPrincipal }: AddAssignmentModalProps) {
  const addAssignments = useStore((s) => s.addAssignments);

  const [principals, setPrincipals] = useState<PrincipalRef[]>(
    initialPrincipal ? [initialPrincipal] : [],
  );
  const [product, setProduct] = useState<ProductId | null>(null);
  const [role, setRole] = useState<string>('');
  const [scopeIds, setScopeIds] = useState<string[]>([]);

  const productScopes = product ? SCOPES.filter((s) => s.product === product) : [];
  const productRoles = product ? ROLES_BY_PRODUCT[product] : [];

  function handleSubmit() {
    if (principals.length === 0) return toast('Select at least one principal', 'error');
    if (!product) return toast('Select a product', 'error');
    if (!role) return toast('Select a role', 'error');
    if (scopeIds.length === 0) return toast('Select at least one scope', 'error');

    const { created, skipped } = addAssignments(principals, product, role, scopeIds);
    if (created === 0 && skipped > 0) {
      toast(`No new assignments — ${skipped} already existed.`, 'success');
    } else {
      toast(
        `Created ${created} assignment${created === 1 ? '' : 's'}${skipped > 0 ? ` (${skipped} already existed)` : ''}`,
        'success',
      );
    }
    onClose();
  }

  function pickProduct(p: ProductId) {
    if (product !== p) {
      setProduct(p);
      setRole('');
      setScopeIds([]);
    }
  }

  return (
    <Modal
      title="Add assignment"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSubmit}>
            Create assignment
          </button>
        </div>
      }
    >
      <div className="label-text" style={{ marginBottom: 6 }}>1 · Principals</div>
      <div className="help" style={{ marginBottom: 8 }}>
        Pick one or more users, service users, or groups. A separate assignment is created for each.
      </div>
      <PrincipalPicker value={principals} onChange={setPrincipals} />

      <div className="section-divider" />

      <div className="label-text" style={{ marginBottom: 6 }}>2 · Product</div>
      <div className="help" style={{ marginBottom: 8 }}>
        Roles and scopes are defined per product. To grant access to another product, create a separate assignment.
      </div>
      <div className="radio-group">
        {PRODUCTS.map((p) => {
          const checked = product === p.id;
          return (
            <label
              key={p.id}
              className={`radio-card ${checked ? 'checked' : ''}`}
              onClick={() => pickProduct(p.id)}
            >
              <input
                type="radio"
                name="product"
                checked={checked}
                onChange={() => pickProduct(p.id)}
              />
              <div>
                <div className="radio-title">{p.name}</div>
                <div className="radio-sub">{p.description}</div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="section-divider" />

      <div className="label-text" style={{ marginBottom: 6 }}>3 · Role</div>
      {!product ? (
        <div className="help">Select a product first.</div>
      ) : (
        <select
          className="select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select a role...</option>
          {productRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      )}

      <div className="section-divider" />

      <div className="label-text" style={{ marginBottom: 6 }}>4 · Scopes</div>
      <div className="help" style={{ marginBottom: 8 }}>
        Pick one or more scopes that this role applies to. These are the resources you've configured for this product.
      </div>
      {!product ? (
        <div className="help">Select a product first.</div>
      ) : (
        <ScopePicker scopes={productScopes} value={scopeIds} onChange={setScopeIds} />
      )}
    </Modal>
  );
}
