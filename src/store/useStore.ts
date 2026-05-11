import { create } from 'zustand';
import {
  IDP_SYNC_POOL,
  SEED_ASSIGNMENTS,
  SEED_GROUPS,
  SEED_SERVICE_USERS,
  SEED_USERS,
} from '@/data/seed';
import { uid } from '@/lib/format';
import type {
  Assignment,
  Group,
  IdpSyncCandidate,
  PrincipalRef,
  PrincipalType,
  ProductId,
  ServiceUser,
  User,
} from '@/types';

interface AddAssignmentResult {
  created: number;
  skipped: number;
}

interface State {
  users: User[];
  serviceUsers: ServiceUser[];
  groups: Group[];
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

  // assignment actions
  addAssignments: (
    principals: PrincipalRef[],
    product: ProductId,
    role: string,
    scopeIds: string[],
  ) => AddAssignmentResult;
  updateAssignment: (id: string, patch: Partial<Pick<Assignment, 'role' | 'scopeIds'>>) => void;
  deleteAssignment: (id: string) => void;
  deleteAssignmentsForPrincipal: (type: PrincipalType, id: string) => void;
}

export const useStore = create<State>((set, get) => ({
  users: SEED_USERS,
  serviceUsers: SEED_SERVICE_USERS,
  groups: SEED_GROUPS,
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

  addAssignments: (principals, product, role, scopeIds) => {
    const now = new Date().toISOString();
    let created = 0;
    let skipped = 0;

    set((s) => {
      let next = s.assignments;
      for (const p of principals) {
        const idx = next.findIndex(
          (a) =>
            a.principalType === p.type &&
            a.principalId === p.id &&
            a.product === product &&
            a.role === role,
        );
        if (idx >= 0) {
          const existing = next[idx];
          const merged = Array.from(new Set([...existing.scopeIds, ...scopeIds]));
          if (merged.length === existing.scopeIds.length) {
            skipped++;
            continue;
          }
          next = next.map((a, i) =>
            i === idx ? { ...a, scopeIds: merged } : a,
          );
          created++;
        } else {
          next = [
            ...next,
            {
              id: uid('a'),
              principalType: p.type,
              principalId: p.id,
              product,
              role,
              scopeIds: scopeIds.slice(),
              createdAt: now,
            },
          ];
          created++;
        }
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
