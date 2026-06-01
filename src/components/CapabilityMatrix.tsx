import { useMemo } from 'react';
import type { Capability, CapabilityGrant } from '@/types';

interface CapabilityMatrixProps {
  capabilities: Capability[];     // catalog for the selected product
  value: CapabilityGrant[];
  onChange: (next: CapabilityGrant[]) => void;
}

// Canonical column order; any action not listed is appended after these.
const ACTION_ORDER = [
  'read', 'create', 'update', 'delete',
  'request', 'reissue', 'issue', 'revoke', 'recover', 'import',
  'validate', 'approve', 'sign', 'publish', 'configure', 'manage', 'export',
];

const READ_ACTIONS = new Set(['read']);

function orderActions(actions: string[]): string[] {
  return actions.slice().sort((a, b) => {
    const ia = ACTION_ORDER.indexOf(a);
    const ib = ACTION_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
}

export function CapabilityMatrix({ capabilities, value, onChange }: CapabilityMatrixProps) {
  // Union of all actions across the product's capabilities → table columns.
  const columns = useMemo(() => {
    const set = new Set<string>();
    capabilities.forEach((c) => c.actions.forEach((a) => set.add(a)));
    return orderActions([...set]);
  }, [capabilities]);

  const grantOf = (capId: string) => value.find((g) => g.capabilityId === capId);
  const isOn = (capId: string, action: string) => !!grantOf(capId)?.actions.includes(action);

  function setGrant(capId: string, actions: string[]) {
    const others = value.filter((g) => g.capabilityId !== capId);
    onChange(actions.length ? [...others, { capabilityId: capId, actions }] : others);
  }

  function toggleCell(cap: Capability, action: string) {
    const current = grantOf(cap.id)?.actions ?? [];
    const next = current.includes(action)
      ? current.filter((a) => a !== action)
      : orderActions([...current, action]);
    setGrant(cap.id, next);
  }

  function toggleRow(cap: Capability) {
    const allOn = cap.actions.every((a) => isOn(cap.id, a));
    setGrant(cap.id, allOn ? [] : cap.actions.slice());
  }

  // Presets
  function presetFull() {
    onChange(capabilities.map((c) => ({ capabilityId: c.id, actions: c.actions.slice() })));
  }
  function presetReadOnly() {
    onChange(
      capabilities
        .map((c) => ({ capabilityId: c.id, actions: c.actions.filter((a) => READ_ACTIONS.has(a)) }))
        .filter((g) => g.actions.length > 0),
    );
  }
  function presetClear() {
    onChange([]);
  }

  return (
    <div>
      <div className="flex gap-8" style={{ marginBottom: 10 }}>
        <button className="btn btn-sm" type="button" onClick={presetReadOnly}>Read-only</button>
        <button className="btn btn-sm" type="button" onClick={presetFull}>Full access</button>
        <button className="btn btn-sm" type="button" onClick={presetClear}>Clear</button>
      </div>

      <div className="cap-matrix-wrap">
        <table className="cap-matrix">
          <thead>
            <tr>
              <th className="cap-matrix-service">Service</th>
              {columns.map((a) => (
                <th key={a} className="cap-matrix-action">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((cap) => {
              const allOn = cap.actions.every((a) => isOn(cap.id, a));
              return (
                <tr key={cap.id}>
                  <td className="cap-matrix-service">
                    <button
                      type="button"
                      className="cap-matrix-rowtoggle"
                      onClick={() => toggleRow(cap)}
                      title={allOn ? 'Clear row' : 'Select all in row'}
                    >
                      {cap.service}
                    </button>
                    <div className="row-sub">{cap.description}</div>
                  </td>
                  {columns.map((action) => {
                    const applicable = cap.actions.includes(action);
                    return (
                      <td key={action} className="cap-matrix-cell">
                        {applicable ? (
                          <input
                            type="checkbox"
                            aria-label={`${cap.service} ${action}`}
                            checked={isOn(cap.id, action)}
                            onChange={() => toggleCell(cap, action)}
                          />
                        ) : (
                          <span className="cap-matrix-na" aria-hidden="true">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
