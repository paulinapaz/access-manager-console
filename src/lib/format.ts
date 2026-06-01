import type { AssignmentActivation } from '@/types';

export function relTime(iso: string | null): string {
  if (!iso) return 'Never';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function dateOnly(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function initials(name: string | undefined | null): string {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export type ActivationStatus = 'Active' | 'Scheduled' | 'Expired' | 'Conditional';

/**
 * Derives the effective status of an assignment from its activation rules.
 * Window bounds take priority (expired/not-yet-started), then contextual
 * conditions mark it as conditionally active, otherwise it is plainly active.
 */
export function activationStatus(a: AssignmentActivation, now: Date = new Date()): ActivationStatus {
  if (a.validUntil && now > new Date(a.validUntil)) return 'Expired';
  if (a.validFrom && now < new Date(a.validFrom)) return 'Scheduled';
  if (a.conditions.length > 0) return 'Conditional';
  return 'Active';
}

/** Short human summary of an activation window, e.g. "Until Jun 1, 2026". */
export function activationWindowLabel(a: AssignmentActivation): string {
  if (a.validFrom && a.validUntil) return `${dateOnly(a.validFrom)} – ${dateOnly(a.validUntil)}`;
  if (a.validFrom) return `From ${dateOnly(a.validFrom)}`;
  if (a.validUntil) return `Until ${dateOnly(a.validUntil)}`;
  return 'No time limit';
}
