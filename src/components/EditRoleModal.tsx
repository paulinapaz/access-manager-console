import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { CAPABILITIES } from '@/data/products';
import { getCapability } from '@/lib/lookups';
import type { CapabilityGrant, Role } from '@/types';
import { Drawer } from './Drawer';
import { CapabilityMatrix } from './CapabilityMatrix';

interface EditRoleModalProps {
  role: Role;
  onClose: () => void;
  /** Force read-only details even for a custom role (e.g. opened by clicking the name). */
  readOnly?: boolean;
}

export function EditRoleModal({ role, onClose, readOnly: forcedReadOnly = false }: EditRoleModalProps) {
  const updateRole = useStore((s) => s.updateRole);
  // Built-in roles are always read-only; custom roles are read-only only when opened for viewing.
  const readOnly = forcedReadOnly || role.type === 'Built-in';

  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [capabilities, setCapabilities] = useState<CapabilityGrant[]>(
    role.capabilities.map((g) => ({ capabilityId: g.capabilityId, actions: g.actions.slice() })),
  );

  const productCapabilities = CAPABILITIES.filter((c) => c.product === role.product);

  function handleSubmit() {
    if (!name.trim()) return toast('Enter a role name', 'error');
    if (capabilities.length === 0) return toast('Select at least one capability action', 'error');
    updateRole(role.id, { name: name.trim(), description: description.trim(), capabilities });
    toast('Role updated', 'success');
    onClose();
  }

  return (
    <Drawer
      title={readOnly ? 'Role details' : 'Edit custom role'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          {!readOnly && (
            <button className="btn btn-primary" type="button" onClick={handleSubmit}>Save changes</button>
          )}
        </div>
      }
    >
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '12px 14px',
          marginBottom: 14,
        }}
      >
        <div className="row-sub" style={{ marginBottom: 4 }}>Product · Type</div>
        <div style={{ fontWeight: 600 }}>
          {role.product}{' '}
          <span className={`pill role-${role.type}`}>{role.type}</span>
        </div>
        {readOnly && (
          <div className="help" style={{ marginTop: 6 }}>
            Built-in roles can't be modified. Create a custom role to tailor capabilities.
          </div>
        )}
      </div>

      {readOnly ? (
        <>
          <div className="label-text" style={{ marginBottom: 6 }}>{role.name}</div>
          <div className="help" style={{ marginBottom: 14 }}>{role.description}</div>

          <div className="label-text" style={{ marginBottom: 6 }}>Capabilities</div>
          <div className="flex-col gap-8">
            {role.capabilities.map((grant) => {
              const c = getCapability(grant.capabilityId);
              if (!c) return null;
              return (
                <div key={grant.capabilityId} className="card" style={{ padding: '10px 12px' }}>
                  <div className="cell-strong">{c.service}</div>
                  <div className="row-sub">{c.description}</div>
                  <div style={{ marginTop: 6 }}>
                    {grant.actions.map((a) => (
                      <span className="scope-tag" key={a}>{a}</span>
                    ))}
                  </div>
                  <div className="row-sub" style={{ marginTop: 6, fontFamily: 'monospace' }}>
                    {c.service}_{grant.actions.join('|')}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <label className="field">
            <span className="label-text">Role name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            <span className="label-text">Description</span>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <div className="section-divider" />

          <div className="label-text" style={{ marginBottom: 6 }}>Capabilities</div>
          <div className="help" style={{ marginBottom: 8 }}>
            Tick the actions this role can perform on each service. Tick a service name to grant all of its actions.
          </div>
          <CapabilityMatrix
            capabilities={productCapabilities}
            value={capabilities}
            onChange={setCapabilities}
          />
        </>
      )}
    </Drawer>
  );
}
