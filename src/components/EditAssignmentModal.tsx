import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { SCOPES } from '@/data/products';
import { principalLabel, principalTypeLabel, getPrincipal } from '@/lib/lookups';
import type { Assignment, AssignmentActivation } from '@/types';
import { Drawer } from './Drawer';
import { RolePicker } from './RolePicker';
import { ScopePicker } from './ScopePicker';
import { AssignmentConditions } from './AssignmentConditions';

interface EditAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
}

type Tab = 'access' | 'conditions';

export function EditAssignmentModal({ assignment, onClose }: EditAssignmentModalProps) {
  const updateAssignment = useStore((s) => s.updateAssignment);
  const allRoles = useStore((s) => s.roles);
  const users = useStore((s) => s.users);
  const serviceUsers = useStore((s) => s.serviceUsers);
  const groups = useStore((s) => s.groups);

  const [tab, setTab] = useState<Tab>('access');
  const [roleIds, setRoleIds] = useState<string[]>(assignment.roleIds.slice());
  const [scopeIds, setScopeIds] = useState(assignment.scopeIds.slice());
  const [activation, setActivation] = useState<AssignmentActivation>({
    ...assignment.activation,
    conditions: assignment.activation.conditions.map((c) => ({ ...c })),
  });

  const productScopes = SCOPES.filter((s) => s.product === assignment.product);
  const productRoles = allRoles.filter((r) => r.product === assignment.product);
  const principal = getPrincipal(
    assignment.principalType,
    assignment.principalId,
    users,
    serviceUsers,
    groups,
  );
  const pLabel = principalLabel(assignment.principalType, principal);

  function handleSubmit() {
    if (roleIds.length === 0) {
      setTab('access');
      return toast('Select at least one role', 'error');
    }
    if (scopeIds.length === 0) {
      setTab('access');
      return toast('Select at least one scope', 'error');
    }
    updateAssignment(assignment.id, { roleIds, scopeIds, activation });
    toast('Assignment updated', 'success');
    onClose();
  }

  return (
    <Drawer
      title="Edit assignment"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" onClick={handleSubmit}>Save changes</button>
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
        <div className="row-sub" style={{ marginBottom: 4 }}>Principal · Product</div>
        <div style={{ fontWeight: 600 }}>
          {pLabel}{' '}
          <span className="cell-muted" style={{ fontWeight: 400 }}>
            ({principalTypeLabel(assignment.principalType)})
          </span>{' '}
          on <span className="pill product">{assignment.product}</span>
        </div>
        <div className="help" style={{ marginTop: 6 }}>
          To change the principal or product, delete this assignment and create a new one.
        </div>
      </div>

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'access'}
          className={`tab ${tab === 'access' ? 'active' : ''}`}
          onClick={() => setTab('access')}
        >
          Access
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'conditions'}
          className={`tab ${tab === 'conditions' ? 'active' : ''}`}
          onClick={() => setTab('conditions')}
        >
          Conditions
        </button>
      </div>

      {tab === 'access' ? (
        <>
          <div className="label-text" style={{ marginBottom: 6 }}>Roles</div>
          <div className="help" style={{ marginBottom: 8 }}>
            All selected roles apply to the scopes below.
          </div>
          <RolePicker roles={productRoles} value={roleIds} onChange={setRoleIds} />

          <div className="section-divider" />

          <div className="label-text" style={{ marginBottom: 6 }}>Scopes</div>
          <ScopePicker scopes={productScopes} value={scopeIds} onChange={setScopeIds} />
        </>
      ) : (
        <AssignmentConditions value={activation} onChange={setActivation} />
      )}
    </Drawer>
  );
}
