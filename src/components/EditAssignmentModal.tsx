import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { ROLES_BY_PRODUCT, SCOPES } from '@/data/products';
import { principalLabel, principalTypeLabel, getPrincipal } from '@/lib/lookups';
import type { Assignment } from '@/types';
import { Modal } from './Modal';
import { ScopePicker } from './ScopePicker';

interface EditAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export function EditAssignmentModal({ assignment, onClose }: EditAssignmentModalProps) {
  const updateAssignment = useStore((s) => s.updateAssignment);
  const users = useStore((s) => s.users);
  const serviceUsers = useStore((s) => s.serviceUsers);
  const groups = useStore((s) => s.groups);

  const [role, setRole] = useState(assignment.role);
  const [scopeIds, setScopeIds] = useState(assignment.scopeIds.slice());

  const productScopes = SCOPES.filter((s) => s.product === assignment.product);
  const productRoles = ROLES_BY_PRODUCT[assignment.product];
  const principal = getPrincipal(
    assignment.principalType,
    assignment.principalId,
    users,
    serviceUsers,
    groups,
  );
  const pLabel = principalLabel(assignment.principalType, principal);

  function handleSubmit() {
    if (scopeIds.length === 0) return toast('Select at least one scope', 'error');
    updateAssignment(assignment.id, { role, scopeIds });
    toast('Assignment updated', 'success');
    onClose();
  }

  return (
    <Modal
      title="Edit assignment"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSubmit}>
            Save changes
          </button>
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

      <div className="label-text" style={{ marginBottom: 6 }}>Role</div>
      <select
        className="select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        {productRoles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <div className="section-divider" />

      <div className="label-text" style={{ marginBottom: 6 }}>Scopes</div>
      <ScopePicker scopes={productScopes} value={scopeIds} onChange={setScopeIds} />
    </Modal>
  );
}
