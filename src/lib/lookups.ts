import type {
  Group,
  Principal,
  PrincipalType,
  ServiceUser,
  User,
} from '@/types';

export function principalTypeLabel(t: PrincipalType): string {
  return t === 'user' ? 'User' : t === 'service_user' ? 'Service user' : 'Group';
}

export function principalLabel(type: PrincipalType, p: Principal | null | undefined): string {
  if (!p) return 'Unknown';
  if (type === 'user') return (p as User).name;
  if (type === 'service_user') return (p as ServiceUser).name;
  return (p as Group).name;
}

export function principalSubLabel(type: PrincipalType, p: Principal | null | undefined): string {
  if (!p) return '';
  if (type === 'user') return '@' + (p as User).username;
  if (type === 'service_user') return '@' + (p as ServiceUser).username;
  return `${(p as Group).memberCount} members`;
}

export function getPrincipal(
  type: PrincipalType,
  id: string,
  users: User[],
  serviceUsers: ServiceUser[],
  groups: Group[],
): Principal | undefined {
  if (type === 'user') return users.find((u) => u.id === id);
  if (type === 'service_user') return serviceUsers.find((u) => u.id === id);
  return groups.find((g) => g.id === id);
}
