import { Link } from 'react-router-dom';
import type { PrincipalType } from '@/types';

interface AssignmentLinkProps {
  count: number;
  principalType: PrincipalType;
  principalId: string;
}

export function AssignmentLink({ count, principalType, principalId }: AssignmentLinkProps) {
  if (count === 0) {
    return <span className="count-zero">0 assignments</span>;
  }
  const search = new URLSearchParams({ principal: `${principalType}:${principalId}` });
  return (
    <Link className="count-link" to={{ pathname: '/assignments', search: search.toString() }}>
      {count} assignment{count === 1 ? '' : 's'}
    </Link>
  );
}
