import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { principalTypeLabel } from '@/lib/lookups';
import type { PrincipalRef, PrincipalType } from '@/types';
import { PrincipalIcon } from './PrincipalIcon';

interface PickerItem {
  type: PrincipalType;
  id: string;
  label: string;
  sub: string;
  hay: string;
}

interface PrincipalPickerProps {
  value: PrincipalRef[];
  onChange: (next: PrincipalRef[]) => void;
}

export function PrincipalPicker({ value, onChange }: PrincipalPickerProps) {
  const users = useStore((s) => s.users);
  const serviceUsers = useStore((s) => s.serviceUsers);
  const groups = useStore((s) => s.groups);
  const [query, setQuery] = useState('');

  const items: PickerItem[] = useMemo(() => {
    const result: PickerItem[] = [];
    users.forEach((u) =>
      result.push({
        type: 'user',
        id: u.id,
        label: u.name,
        sub: `@${u.username} · ${u.email}`,
        hay: `${u.name} ${u.username} ${u.email}`,
      }),
    );
    serviceUsers.forEach((u) =>
      result.push({
        type: 'service_user',
        id: u.id,
        label: u.name,
        sub: `@${u.username} · Service user`,
        hay: `${u.name} ${u.username}`,
      }),
    );
    groups.forEach((g) =>
      result.push({
        type: 'group',
        id: g.id,
        label: g.name,
        sub:
          g.source === 'Product'
            ? `${g.memberCount} members · ${g.origin?.kind} — its members (the ${g.origin?.kind} itself is selectable as a scope)`
            : `${g.memberCount} members · SCIM group`,
        hay: g.name,
      }),
    );
    return result;
  }, [users, serviceUsers, groups]);

  const ql = query.toLowerCase().trim();
  const filtered = items
    .filter((i) => !ql || i.hay.toLowerCase().includes(ql))
    .slice(0, 50);

  const selectedSet = new Set(value.map((p) => `${p.type}:${p.id}`));
  const isSelected = (i: PickerItem) => selectedSet.has(`${i.type}:${i.id}`);

  function toggle(i: PickerItem) {
    if (isSelected(i)) {
      onChange(value.filter((p) => !(p.type === i.type && p.id === i.id)));
    } else {
      onChange([...value, { type: i.type, id: i.id }]);
    }
  }

  function removeChip(p: PrincipalRef) {
    onChange(value.filter((x) => !(x.type === p.type && x.id === p.id)));
  }

  return (
    <div className="picker">
      <div className="picker-input">
        {value.map((p) => {
          const found = items.find((i) => i.type === p.type && i.id === p.id);
          const label = found ? found.label : 'Unknown';
          return (
            <span className="chip" key={`${p.type}:${p.id}`}>
              {principalTypeLabel(p.type)}: {label}
              <button title="Remove" onClick={() => removeChip(p)} type="button">
                &times;
              </button>
            </span>
          );
        })}
        <input
          placeholder="Search users, service users, or groups..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="picker-list">
        {filtered.length === 0 ? (
          <div className="empty" style={{ padding: '20px 12px' }}>No matches.</div>
        ) : (
          filtered.map((i) => (
            <div
              key={`${i.type}:${i.id}`}
              className={`picker-option ${isSelected(i) ? 'selected' : ''}`}
              onClick={() => toggle(i)}
            >
              <PrincipalIcon type={i.type} name={i.label} size="sm" />
              <div>
                <div className="opt-title">{i.label}</div>
                <div className="opt-sub">{i.sub}</div>
              </div>
              <div className="opt-meta">
                <span className="pill product">{principalTypeLabel(i.type)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
