import { useState } from 'react';
import type { Scope } from '@/types';

interface ScopePickerProps {
  scopes: Scope[];
  value: string[];
  onChange: (next: string[]) => void;
}

export function ScopePicker({ scopes, value, onChange }: ScopePickerProps) {
  const [query, setQuery] = useState('');
  const ql = query.toLowerCase().trim();
  const selected = new Set(value);

  const filtered = scopes.filter(
    (s) => !ql || s.name.toLowerCase().includes(ql) || s.kind.toLowerCase().includes(ql),
  );

  function toggle(id: string) {
    if (selected.has(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="picker">
      <div className="picker-input">
        {value.map((id) => {
          const s = scopes.find((x) => x.id === id);
          if (!s) return null;
          return (
            <span className="chip" key={id}>
              {s.name}
              <button title="Remove" onClick={() => toggle(id)} type="button">
                &times;
              </button>
            </span>
          );
        })}
        <input
          placeholder="Search scopes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="picker-list">
        {filtered.length === 0 ? (
          <div className="empty" style={{ padding: '20px 12px' }}>No scopes match.</div>
        ) : (
          filtered.map((s) => {
            const isSel = selected.has(s.id);
            return (
              <div
                key={s.id}
                className={`picker-option ${isSel ? 'selected' : ''}`}
                onClick={() => toggle(s.id)}
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <div className="opt-title">{s.name}</div>
                  <div className="opt-sub">{s.kind}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
