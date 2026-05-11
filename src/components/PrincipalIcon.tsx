import { initials } from '@/lib/format';
import type { PrincipalType } from '@/types';

interface PrincipalIconProps {
  type: PrincipalType;
  name: string;
  size?: 'sm' | 'md';
}

export function PrincipalIcon({ type, name, size = 'md' }: PrincipalIconProps) {
  const style =
    size === 'sm' ? { width: 28, height: 28, fontSize: 11 } : undefined;
  return (
    <div className={`principal-icon ${type}`} style={style}>
      {initials(name)}
    </div>
  );
}
