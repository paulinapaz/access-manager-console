import { create } from 'zustand';
import {
  IDP_SYNC_POOL,
  SEED_ASSIGNMENTS,
  SEED_GROUPS,
  SEED_SERVICE_USERS,
  SEED_USERS,
} from '@/data/seed';
import { SCOPES, SEED_ROLES, productGroupsFromScopes } from '@/data/products';
import { uid } from '@/lib/format';
import type {
  Assignment,
  AssignmentActivation,
  Group,
  IdpSyncCandidate,
  PrincipalRef,
  PrincipalType,
  ProductId,
  Role,
  ServiceUser,
  User,
} from '@/types';

interface AddAssignmentResult {
  created: number;
  skipped: number;
}

const sortedKey = (xs: string[]) => xs.slice().sort().join('|');

interface State {
  users: User[];
  serviceUsers: ServiceUser[];
  groups: Group[];
  roles: Role[];
  assignments: Assignment[];
  idpSyncPool: IdpSyncCandidate[];

  // user actions
  addUser: (input: Omit<User, 'id'>) => User;
  updateUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
  syncIdpUsers: (max?: number) => User[];

  // service user actions
  addServiceUser: (input: Omit<ServiceUser, 'id'>) => ServiceUser;
  updateServiceUser: (id: string, patch: Partial<ServiceUser>) => void;
  deleteServiceUser: (id: string) => void;

  // role actions (Built-in roles are non-modifiable; only Custom roles can be edited/deleted)
  addRole: (input: Omit<Role, 'id' | 'type'>) => Role;
  updateRole: (id: string, patch: Partial<Pick<Role, 'name' | 'description' | 'capabilities'>>) => void;
  deleteRole: (id: string) => void;

  // assignment actions
  addAssignments: (
    principals: PrincipalRef[],
    product: ProductId,
    roleIds: string[],
    scopeIds: string[],
    activation: AssignmentActivation,
  ) => AddAssignmentResult;
  updateAssignment: (
    id: string,
    patch: Partial<Pick<Assignment, 'roleIds' | 'scopeIds' | 'activation'>>,
  ) => void;
  deleteAssignment: (id: string) => void;
  deleteAssignmentsForPrincipal: (type: PrincipalType, id: string) => void;
}

export const useStore = create<State>((set, get) => ({
  users: SEED_USERS,
  serviceUsers: SEED_SERVICE_USERS,
  // IDP/SCIM groups plus the product-partition groups synced from the scope catalog.
  groups: [...SEED_GROUPS, ...productGroupsFromScopes(SCOPES, SEED_USERS)],
  roles: SEED_ROLES,
  assignments: SEED_ASSIGNMENTS,
  idpSyncPool: IDP_SYNC_POOL,

  addUser: (input) => {
    const user: User = { ...input, id: uid('u') };
    set((s) => ({ users: [user, ...s.users] }));
    return user;
  },
  updateUser: (id, patch) => {
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));
  },
  deleteUser: (id) => {
    set((s) => ({
      users: s.users.filter((u) => u.id !== id),
      assignments: s.assignments.filter(
        (a) => !(a.principalType === 'user' && a.principalId === id),
      ),
    }));
  },
  syncIdpUsers: (max = 2) => {
    const { users, idpSyncPool } = get();
    const existing = new Set(users.map((u) => u.username));
    const candidates = idpSyncPool.filter((c) => !existing.has(c.username)).slice(0, max);
    if (candidates.length === 0) return [];
    const nowIso = new Date().toISOString();
    const newUsers: User[] = candidates.map((c) => ({
      id: uid('u'),
      username: c.username,
      name: c.name,
      email: c.email,
      status: 'Active',
      type: 'IDP',
      lastActive: nowIso,
    }));
    set((s) => ({ users: [...newUsers, ...s.users] }));
    return newUsers;
  },

  addServiceUser: (input) => {
    const sa: ServiceUser = { ...input, id: uid('sa') };
    set((s) => ({ serviceUsers: [sa, ...s.serviceUsers] }));
    return sa;
  },
  updateServiceUser: (id, patch) => {
    set((s) => ({
      serviceUsers: s.serviceUsers.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));
  },
  deleteServiceUser: (id) => {
    set((s) => ({
      serviceUsers: s.serviceUsers.filter((u) => u.id !== id),
      assignments: s.assignments.filter(
        (a) => !(a.principalType === 'service_user' && a.principalId === id),
      ),
    }));
  },

  addRole: (input) => {
    const role: Role = { ...input, id: uid('r'), type: 'Custom' };
    set((s) => ({ roles: [role, ...s.roles] }));
    return role;
  },
  updateRole: (id, patch) => {
    set((s) => ({
      roles: s.roles.map((r) =>
        r.id === id && r.type === 'Custom' ? { ...r, ...patch } : r,
      ),
    }));
  },
  deleteRole: (id) => {
    set((s) => {
      const role = s.roles.find((r) => r.id === id);
      if (!role || role.type !== 'Custom') return s; // Built-in roles are non-modifiable
      return {
        roles: s.roles.filter((r) => r.id !== id),
        // Strip the role from any assignments; drop assignments left with no roles.
        assignments: s.assignments
          .map((a) =>
            a.roleIds.includes(id)
              ? { ...a, roleIds: a.roleIds.filter((rid) => rid !== id) }
              : a,
          )
          .filter((a) => a.roleIds.length > 0),
      };
    });
  },

  addAssignments: (principals, product, roleIds, scopeIds, activation) => {
    const now = new Date().toISOString();
    let created = 0;
    let skipped = 0;
    const rolesKey = sortedKey(roleIds);
    const scopesKey = sortedKey(scopeIds);

    set((s) => {
      let next = s.assignments;
      for (const p of principals) {
        // Skip if an identical grant (same product + roles + scopes) already exists.
        const dup = next.some(
          (a) =>
            a.principalType === p.type &&
            a.principalId === p.id &&
            a.product === product &&
            sortedKey(a.roleIds) === rolesKey &&
            sortedKey(a.scopeIds) === scopesKey,
        );
        if (dup) {
          skipped++;
          continue;
        }
        next = [
          ...next,
          {
            id: uid('a'),
            principalType: p.type,
            principalId: p.id,
            product,
            roleIds: roleIds.slice(),
            scopeIds: scopeIds.slice(),
            activation,
            createdAt: now,
          },
        ];
        created++;
      }
      return { assignments: next };
    });

    return { created, skipped };
  },
  updateAssignment: (id, patch) => {
    set((s) => ({
      assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  },
  deleteAssignment: (id) => {
    set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) }));
  },
  deleteAssignmentsForPrincipal: (type, id) => {
    set((s) => ({
      assignments: s.assignments.filter(
        (a) => !(a.principalType === type && a.principalId === id),
      ),
    }));
  },
}));

export function useAssignmentCount(type: PrincipalType, id: string): number {
  return useStore(
    (s) =>
      s.assignments.filter((a) => a.principalType === type && a.principalId === id).length,
  );
}
