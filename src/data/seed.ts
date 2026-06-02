import type {
  Assignment,
  AssignmentActivation,
  Group,
  IdpSyncCandidate,
  PrincipalRef,
  ProductId,
  ServiceUser,
  User,
} from '@/types';
import { roleId } from '@/data/products';

/** Always-on activation: no window, no conditions. */
const always: AssignmentActivation = { validFrom: null, validUntil: null, conditions: [] };

/** Helper to reference one or more system roles by name for a product. */
function roles(product: ProductId, ...names: string[]): string[] {
  return names.map((n) => roleId(product, n));
}

export const SEED_USERS: User[] = [
  { id: 'u1',  username: 'jsmith',     name: 'Jane Smith',      email: 'jane.smith@acme.com',  status: 'Active',  type: 'IDP',    lastActive: '2026-05-08T08:14:00Z' },
  { id: 'u2',  username: 'bjohnson',   name: 'Bob Johnson',     email: 'bob.j@acme.com',       status: 'Pending', type: 'Manual', lastActive: null },
  { id: 'u3',  username: 'apatel',     name: 'Anika Patel',     email: 'anika.patel@acme.com', status: 'Active',  type: 'IDP',    lastActive: '2026-05-07T15:42:00Z' },
  { id: 'u4',  username: 'mlopez',     name: 'Miguel Lopez',    email: 'miguel.l@acme.com',    status: 'Active',  type: 'IDP',    lastActive: '2026-05-06T10:05:00Z' },
  { id: 'u5',  username: 'nzhang',     name: 'Nina Zhang',      email: 'nina.zhang@acme.com',  status: 'Revoked', type: 'IDP',    lastActive: '2026-04-22T13:30:00Z' },
  { id: 'u6',  username: 'kbrown',     name: 'Kevin Brown',     email: 'k.brown@acme.com',     status: 'Active',  type: 'Manual', lastActive: '2026-05-05T11:11:00Z' },
  { id: 'u7',  username: 'lhernandez', name: 'Lucia Hernandez', email: 'lucia.h@acme.com',     status: 'Active',  type: 'IDP',    lastActive: '2026-05-08T07:50:00Z' },
  { id: 'u8',  username: 'rkapoor',    name: 'Ravi Kapoor',     email: 'ravi.kapoor@acme.com', status: 'Pending', type: 'Manual', lastActive: null },
  { id: 'u9',  username: 'eokafor',    name: 'Emeka Okafor',    email: 'emeka.o@acme.com',     status: 'Active',  type: 'IDP',    lastActive: '2026-05-07T22:00:00Z' },
  { id: 'u10', username: 'sthomas',    name: 'Sarah Thomas',    email: 'sarah.t@acme.com',     status: 'Active',  type: 'IDP',    lastActive: '2026-05-08T09:02:00Z' },
];

export const SEED_SERVICE_USERS: ServiceUser[] = [
  { id: 'sa1', username: 'ci-cd-prod',       name: 'CI/CD Pipeline (Prod)', description: 'GitHub Actions service account for production builds', status: 'Active',  type: 'Manual', lastActive: '2026-05-08T09:30:00Z' },
  { id: 'sa2', username: 'terraform-runner', name: 'Terraform Runner',      description: 'Infra automation service account',                       status: 'Active',  type: 'Manual', lastActive: '2026-05-08T06:15:00Z' },
  { id: 'sa3', username: 'cert-monitor',     name: 'Certificate Monitor',   description: 'Read-only monitoring of cert expiry',                    status: 'Active',  type: 'Manual', lastActive: '2026-05-08T09:45:00Z' },
  { id: 'sa4', username: 'sbom-publisher',   name: 'SBOM Publisher',        description: 'Publishes SBOMs after release builds',                  status: 'Active',  type: 'IDP',    lastActive: '2026-05-07T18:20:00Z' },
  { id: 'sa5', username: 'legacy-importer',  name: 'Legacy Importer',       description: 'One-off cert import service (deprecated)',              status: 'Revoked', type: 'Manual', lastActive: '2026-03-12T10:00:00Z' },
];

/** Build user member refs from seed user ids. */
const userMembers = (...ids: string[]): PrincipalRef[] => ids.map((id) => ({ type: 'user', id }));

/**
 * IDP / SCIM groups — membership owned by the identity provider (Okta). Member lists
 * are mocked from the seed user pool; `memberCount` matches so the count shown on the
 * Groups page agrees with the filtered Users view it links to. Product-native groups
 * (the membership facet of product partitions) are not seeded here; they are generated
 * from the scope catalog by `productGroupsFromScopes` and combined in the store.
 */
const SCIM_GROUPS: Array<Omit<Group, 'memberCount'> & { members: PrincipalRef[] }> = [
  { id: 'g1', name: 'Engineering',       source: 'IDP', externalId: 'okta-eng-001', members: userMembers('u1', 'u3', 'u4', 'u9') },
  { id: 'g2', name: 'Security Team',     source: 'IDP', externalId: 'okta-sec-002', members: userMembers('u6', 'u7') },
  { id: 'g3', name: 'Finance',           source: 'IDP', externalId: 'okta-fin-003', members: userMembers('u8', 'u10') },
  { id: 'g4', name: 'IT Operations',     source: 'IDP', externalId: 'okta-ito-004', members: userMembers('u4', 'u6', 'u9') },
  { id: 'g5', name: 'Sales & Marketing', source: 'IDP', externalId: 'okta-sm-005', members: userMembers('u2', 'u7', 'u10') },
  { id: 'g6', name: 'Mobile Dev Team',   source: 'IDP', externalId: 'okta-mob-006', members: userMembers('u1', 'u3') },
  { id: 'g7', name: 'Compliance',        source: 'IDP', externalId: 'okta-cmp-007', members: userMembers('u5', 'u8') },
];

export const SEED_GROUPS: Group[] = SCIM_GROUPS.map((g) => ({ ...g, memberCount: g.members.length }));

export const SEED_ASSIGNMENTS: Assignment[] = [
  { id: 'a1',  principalType: 'user',         principalId: 'u1',  product: 'CertCentral',     roleIds: roles('CertCentral', 'Manager'),                    scopeIds: ['sc-cc-1'],                                  activation: always, createdAt: '2026-04-12T10:00:00Z' },
  // Expired window — access lapsed on 2026-05-15
  { id: 'a2',  principalType: 'user',         principalId: 'u1',  product: 'DigiCert DNS',    roleIds: roles('DigiCert DNS', 'Administrator'),             scopeIds: ['sc-dns-1', 'sc-dns-2'],                     activation: { validFrom: null, validUntil: '2026-05-15T00:00:00Z', conditions: [] }, createdAt: '2026-04-12T10:05:00Z' },
  // Multi-role assignment
  { id: 'a3',  principalType: 'user',         principalId: 'u3',  product: 'Software Trust',  roleIds: roles('Software Trust', 'Manager', 'Signer'),       scopeIds: ['sc-st-1', 'sc-st-3'],                       activation: always, createdAt: '2026-04-15T14:22:00Z' },
  // Scheduled — starts 2026-07-01
  { id: 'a4',  principalType: 'user',         principalId: 'u4',  product: 'Trust Lifecycle', roleIds: roles('Trust Lifecycle', 'User and certificate manager'), scopeIds: ['sc-tl-1'],                             activation: { validFrom: '2026-07-01T00:00:00Z', validUntil: null, conditions: [] }, createdAt: '2026-04-18T09:15:00Z' },
  { id: 'a5',  principalType: 'user',         principalId: 'u7',  product: 'CertCentral',     roleIds: roles('CertCentral', 'Standard User'),              scopeIds: ['sc-cc-2'],                                  activation: always, createdAt: '2026-04-21T11:00:00Z' },
  { id: 'a6',  principalType: 'user',         principalId: 'u9',  product: 'Software Trust',  roleIds: roles('Software Trust', 'Signer'),                  scopeIds: ['sc-st-2', 'sc-st-5'],                       activation: always, createdAt: '2026-04-22T16:30:00Z' },
  { id: 'a7',  principalType: 'user',         principalId: 'u10', product: 'Trust Lifecycle', roleIds: roles('Trust Lifecycle', 'View only'),              scopeIds: ['sc-tl-1', 'sc-tl-2'],                       activation: always, createdAt: '2026-04-25T10:45:00Z' },
  { id: 'a8',  principalType: 'group',        principalId: 'g1',  product: 'CertCentral',     roleIds: roles('CertCentral', 'Standard User'),              scopeIds: ['sc-cc-1'],                                  activation: always, createdAt: '2026-04-10T08:00:00Z' },
  { id: 'a9',  principalType: 'group',        principalId: 'g1',  product: 'Software Trust',  roleIds: roles('Software Trust', 'Signer'),                  scopeIds: ['sc-st-1', 'sc-st-2'],                       activation: always, createdAt: '2026-04-10T08:05:00Z' },
  { id: 'a10', principalType: 'group',        principalId: 'g2',  product: 'CertCentral',     roleIds: roles('CertCentral', 'Administrator'),              scopeIds: ['sc-cc-1', 'sc-cc-2', 'sc-cc-3', 'sc-cc-4'], activation: always, createdAt: '2026-04-11T09:30:00Z' },
  { id: 'a11', principalType: 'group',        principalId: 'g2',  product: 'Trust Lifecycle', roleIds: roles('Trust Lifecycle', 'Manager'),                scopeIds: ['sc-tl-1', 'sc-tl-2'],                       activation: always, createdAt: '2026-04-11T09:35:00Z' },
  { id: 'a12', principalType: 'group',        principalId: 'g4',  product: 'DigiCert DNS',    roleIds: roles('DigiCert DNS', 'Administrator'),             scopeIds: ['sc-dns-1', 'sc-dns-2', 'sc-dns-3', 'sc-dns-4'], activation: always, createdAt: '2026-04-13T12:00:00Z' },
  // Conditional — only active while a change ticket is open
  { id: 'a13', principalType: 'service_user', principalId: 'sa1', product: 'Software Trust',  roleIds: roles('Software Trust', 'Key manager'),             scopeIds: ['sc-st-1', 'sc-st-2', 'sc-st-3'],            activation: { validFrom: null, validUntil: null, conditions: [{ id: 'cond-a13-1', attribute: 'ticket.status', operator: 'equals', value: 'open' }] }, createdAt: '2026-04-14T15:20:00Z' },
  { id: 'a14', principalType: 'service_user', principalId: 'sa2', product: 'DigiCert DNS',    roleIds: roles('DigiCert DNS', 'Administrator'),             scopeIds: ['sc-dns-1', 'sc-dns-2'],                     activation: always, createdAt: '2026-04-16T11:10:00Z' },
  { id: 'a15', principalType: 'service_user', principalId: 'sa3', product: 'CertCentral',     roleIds: roles('CertCentral', 'Standard User'),              scopeIds: ['sc-cc-5', 'sc-cc-6'],                       activation: always, createdAt: '2026-04-19T13:40:00Z' },
];

export const IDP_SYNC_POOL: IdpSyncCandidate[] = [
  { username: 'tmurphy',  name: 'Tom Murphy',    email: 'tom.murphy@acme.com' },
  { username: 'cdavis',   name: 'Carla Davis',   email: 'carla.davis@acme.com' },
  { username: 'fkhan',    name: 'Fatima Khan',   email: 'fatima.khan@acme.com' },
  { username: 'gschmidt', name: 'Greta Schmidt', email: 'greta.schmidt@acme.com' },
  { username: 'hpark',    name: 'Hyun Park',     email: 'hyun.park@acme.com' },
];
