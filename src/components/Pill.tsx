import type { ReactNode } from 'react';

interface StatusPillProps {
  status: 'Active' | 'Pending' | 'Revoked';
}
export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`pill status-${status}`}>
      <span className="dot" />
      {status}
    </span>
  );
}

interface SourcePillProps {
  type: 'Manual' | 'IDP';
}
export function SourcePill({ type }: SourcePillProps) {
  return <span className={`pill type-${type}`}>{type}</span>;
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`pill ${className}`}>{children}</span>;
}
