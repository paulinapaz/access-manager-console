import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { PRODUCTS, SCOPES } from '@/data/products';
import type { AssignmentActivation, PrincipalRef, ProductId } from '@/types';
import { Drawer } from './Drawer';
import { PrincipalPicker } from './PrincipalPicker';
import { RolePicker } from './RolePicker';
import { ScopePicker } from './ScopePicker';
import { AssignmentConditions } from './AssignmentConditions';

interface AddAssignmentModalProps {
  onClose: () => void;
  initialPrincipal?: PrincipalRef | null;
}

const EMPTY_ACTIVATION: AssignmentActivation = { validFrom: null, validUntil: null, conditions: [] };

const STEP_LABELS = ['Principals', 'Product, roles & scopes', 'Conditions'] as const;

export function AddAssignmentModal({ onClose, initialPrincipal }: AddAssignmentModalProps) {
  const addAssignments = useStore((s) => s.addAssignments);
  const allRoles = useStore((s) => s.roles);
  const groups = useStore((s) => s.groups);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [principals, setPrincipals] = useState<PrincipalRef[]>(
    initialPrincipal ? [initialPrincipal] : [],
  );
  const [product, setProduct] = useState<ProductId | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [scopeIds, setScopeIds] = useState<string[]>([]);
  const [activation, setActivation] = useState<AssignmentActivation>(EMPTY_ACTIVATION);

  const productScopes = product ? SCOPES.filter((s) => s.product === product) : [];
  const productRoles = product ? allRoles.filter((r) => r.product === product) : [];

  // Partition scopes that are selected and also exist as a principal group — surface the
  // linkage so the admin can target the partition's *members* instead of (or as well as)
  // scoping to its resources.
  const selectedAsPrincipal = new Set(
    principals.filter((p) => p.type === 'group').map((p) => p.id),
  );
  const linkedGroups = productScopes
    .filter((s) => scopeIds.includes(s.id) && s.origin)
    .map((s) => groups.find((g) => g.origin?.externalId === s.origin!.externalId))
    .filter((g): g is NonNullable<typeof g> => Boolean(g) && !selectedAsPrincipal.has(g!.id));

  function pickProduct(p: ProductId) {
    if (product !== p) {
      setProduct(p);
      setRoleIds([]);
      setScopeIds([]);
    }
  }

  function goToAccess() {
    if (principals.length === 0) return toast('Select at least one principal', 'error');
    setStep(2);
  }

  function goToConditions() {
    if (!product) return toast('Select a product', 'error');
    if (roleIds.length === 0) return toast('Select at least one role', 'error');
    if (scopeIds.length === 0) return toast('Select at least one scope', 'error');
    setStep(3);
  }

  function handleSubmit() {
    const { created, skipped } = addAssignments(principals, product!, roleIds, scopeIds, activation);
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

  const footer =
    step === 1 ? (
      <div className="flex gap-8">
        <button className="btn" type="button" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" type="button" onClick={goToAccess}>Next: Roles &amp; scopes</button>
      </div>
    ) : step === 2 ? (
      <div className="flex gap-8">
        <button className="btn" type="button" onClick={() => setStep(1)}>Back</button>
        <button className="btn btn-primary" type="button" onClick={goToConditions}>Next: Conditions</button>
      </div>
    ) : (
      <div className="flex gap-8">
        <button className="btn" type="button" onClick={() => setStep(2)}>Back</button>
        <button className="btn btn-primary" type="button" onClick={handleSubmit}>Create assignment</button>
      </div>
    );

  return (
    <Drawer
      title="Add assignment"
      subtitle={`Step ${step} of 3 — ${STEP_LABELS[step - 1]}`}
      onClose={onClose}
      size="lg"
      footer={footer}
    >
      {step === 1 && (
        <>
          <div className="help" style={{ marginBottom: 8 }}>
            Pick one or more users, service users, or groups. A separate assignment is created for each.
          </div>
          <PrincipalPicker value={principals} onChange={setPrincipals} />
        </>
      )}

      {step === 2 && (
        <>
          <div className="label-text" style={{ marginBottom: 6 }}>Product</div>
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
                  <input type="radio" name="product" checked={checked} onChange={() => pickProduct(p.id)} />
                  <div>
                    <div className="radio-title">{p.name}</div>
                    <div className="radio-sub">{p.description}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="section-divider" />

          <div className="label-text" style={{ marginBottom: 6 }}>Roles</div>
          <div className="help" style={{ marginBottom: 8 }}>
            Grant one or more roles. All selected roles apply to the scopes chosen below.
          </div>
          {!product ? (
            <div className="help">Select a product first.</div>
          ) : (
            <RolePicker roles={productRoles} value={roleIds} onChange={setRoleIds} />
          )}

          <div className="section-divider" />

          <div className="label-text" style={{ marginBottom: 6 }}>Scopes</div>
          <div className="help" style={{ marginBottom: 8 }}>
            The resources these roles apply to.
          </div>
          {!product ? (
            <div className="help">Select a product first.</div>
          ) : (
            <ScopePicker scopes={productScopes} value={scopeIds} onChange={setScopeIds} />
          )}

          {linkedGroups.length > 0 && (
            <div className="help" style={{ marginTop: 8 }}>
              {linkedGroups.length === 1
                ? `“${linkedGroups[0].name}” is also a principal group (${linkedGroups[0].memberCount} members). `
                : `${linkedGroups.length} selected scopes are also principal groups. `}
              You can grant these roles to their members instead of (or as well as) scoping to the partition.{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setPrincipals([
                    ...principals,
                    ...linkedGroups.map((g) => ({ type: 'group' as const, id: g.id })),
                  ]);
                  toast(
                    `Added ${linkedGroups.length} partition group${linkedGroups.length === 1 ? '' : 's'} to principals`,
                    'success',
                  );
                }}
              >
                Add their members as principals
              </button>
            </div>
          )}
        </>
      )}

      {step === 3 && (
        <AssignmentConditions value={activation} onChange={setActivation} />
      )}
    </Drawer>
  );
}
