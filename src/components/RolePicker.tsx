import { useState } from 'react';
import type { Role } from '@/types';

interface RolePickerProps {
  roles: Role[];
  value: string[];
  onChange: (next: string[]) => void;
}

export function RolePicker({ roles, value, onChange }: RolePickerProps) {
  const [query, setQuery] = useState('');
  const ql = query.toLowerCase().trim();
  const selected = new Set(value);

  const filtered = roles.filter(
    (r) => !ql || r.name.toLowerCase().includes(ql) || r.description.toLowerCase().includes(ql),
  );

  function toggle(id: string) {
    if (selected.has(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="picker">
      <div className="picker-input">
        {value.map((id) => {
          const r = roles.find((x) => x.id === id);
          if (!r) return null;
          return (
            <span className="chip" key={id}>
              {r.name}
              <button title="Remove" onClick={() => toggle(id)} type="button">
                &times;
              </button>
            </span>
          );
        })}
        <input
          placeholder="Search roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="picker-list">
        {filtered.length === 0 ? (
          <div className="empty" style={{ padding: '20px 12px' }}>No roles match.</div>
        ) : (
          filtered.map((r) => {
            const isSel = selected.has(r.id);
            return (
              <div
                key={r.id}
                className={`picker-option ${isSel ? 'selected' : ''}`}
                onClick={() => toggle(r.id)}
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(r.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <div className="opt-title">{r.name}</div>
                  <div className="opt-sub">
                    {r.description} · {r.capabilities.length} capabilit{r.capabilities.length === 1 ? 'y' : 'ies'}
                  </div>
                </div>
                <div className="opt-meta">
                  <span className={`pill role-${r.type}`}>{r.type}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
