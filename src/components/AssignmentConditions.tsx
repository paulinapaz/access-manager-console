import { uid } from '@/lib/format';
import { PlusIcon } from '@/lib/icons';
import type { AssignmentActivation, AssignmentCondition, ConditionOperator } from '@/types';

interface AssignmentConditionsProps {
  value: AssignmentActivation;
  onChange: (next: AssignmentActivation) => void;
}

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'in', label: 'is one of' },
  { value: 'exists', label: 'exists' },
];

// <input type="date"> works in YYYY-MM-DD; we store full ISO.
const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
const fromDateInput = (d: string) => (d ? `${d}T00:00:00Z` : null);

export function AssignmentConditions({ value, onChange }: AssignmentConditionsProps) {
  function setWindow(patch: Partial<Pick<AssignmentActivation, 'validFrom' | 'validUntil'>>) {
    onChange({ ...value, ...patch });
  }

  function addCondition() {
    const cond: AssignmentCondition = { id: uid('cond'), attribute: '', operator: 'equals', value: '' };
    onChange({ ...value, conditions: [...value.conditions, cond] });
  }

  function updateCondition(id: string, patch: Partial<AssignmentCondition>) {
    onChange({
      ...value,
      conditions: value.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  }

  function removeCondition(id: string) {
    onChange({ ...value, conditions: value.conditions.filter((c) => c.id !== id) });
  }

  return (
    <div>
      <div className="help" style={{ marginBottom: 10 }}>
        Control <strong>when</strong> this assignment is active. Leave everything blank for an
        always-on grant.
      </div>

      <div className="flex gap-12" style={{ marginBottom: 14 }}>
        <label className="field" style={{ flex: 1, marginBottom: 0 }}>
          <span className="label-text">Active from</span>
          <input
            className="input"
            type="date"
            value={toDateInput(value.validFrom)}
            onChange={(e) => setWindow({ validFrom: fromDateInput(e.target.value) })}
          />
        </label>
        <label className="field" style={{ flex: 1, marginBottom: 0 }}>
          <span className="label-text">Active until</span>
          <input
            className="input"
            type="date"
            value={toDateInput(value.validUntil)}
            onChange={(e) => setWindow({ validUntil: fromDateInput(e.target.value) })}
          />
        </label>
      </div>

      <div className="label-text" style={{ marginBottom: 6 }}>Conditions</div>
      <div className="help" style={{ marginBottom: 8 }}>
        The assignment activates only when all conditions hold (e.g. an active ticket, an
        environment, or a policy attribute).
      </div>

      {value.conditions.length > 0 && (
        <div className="flex-col gap-8" style={{ marginBottom: 10 }}>
          {value.conditions.map((c) => (
            <div className="flex gap-8" key={c.id} style={{ alignItems: 'center' }}>
              <input
                className="input"
                style={{ flex: 2 }}
                placeholder="attribute (e.g. ticket.status)"
                value={c.attribute}
                onChange={(e) => updateCondition(c.id, { attribute: e.target.value })}
              />
              <select
                className="select"
                style={{ flex: 1 }}
                value={c.operator}
                onChange={(e) => updateCondition(c.id, { operator: e.target.value as ConditionOperator })}
              >
                {OPERATORS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <input
                className="input"
                style={{ flex: 2 }}
                placeholder={c.operator === 'in' ? 'value, value, …' : 'value'}
                value={c.value}
                disabled={c.operator === 'exists'}
                onChange={(e) => updateCondition(c.id, { value: e.target.value })}
              />
              <button
                className="btn-icon"
                type="button"
                title="Remove condition"
                onClick={() => removeCondition(c.id)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-sm" type="button" onClick={addCondition}>
        <PlusIcon /> Add condition
      </button>
    </div>
  );
}
