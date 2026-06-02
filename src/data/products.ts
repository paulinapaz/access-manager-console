import type {
  Capability,
  CapabilityGrant,
  Group,
  PrincipalRef,
  Product,
  ProductId,
  Role,
  Scope,
  User,
} from '@/types';

export const PRODUCTS: Product[] = [
  { id: 'CertCentral',     name: 'CertCentral',     description: 'Public TLS certificate lifecycle' },
  { id: 'DigiCert DNS',    name: 'DigiCert DNS',    description: 'Authoritative DNS management' },
  { id: 'Software Trust',  name: 'Software Trust',  description: 'Code signing & SBOM management' },
  { id: 'Trust Lifecycle', name: 'Trust Lifecycle', description: 'Enterprise PKI & private trust' },
];

/** Short product code used to namespace role/capability ids. */
export const PRODUCT_ABBR: Record<ProductId, string> = {
  'CertCentral': 'cc',
  'DigiCert DNS': 'dns',
  'Software Trust': 'st',
  'Trust Lifecycle': 'tl',
};

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Deterministic id for a (product, role name) pair — used to migrate seed data. */
export function roleId(product: ProductId, name: string): string {
  return `r-${PRODUCT_ABBR[product]}-${slug(name)}`;
}

// ── Capability catalog (service_endpoint(s)_action(s)) ──────────────────────
export const CAPABILITIES: Capability[] = [
  // CertCentral
  { id: 'cap-cc-certificates', product: 'CertCentral', service: 'certificates', actions: ['read', 'request', 'reissue', 'revoke'], description: 'Manage TLS certificate lifecycle' },
  { id: 'cap-cc-orders',       product: 'CertCentral', service: 'orders',       actions: ['read', 'approve'],                       description: 'Review and approve certificate orders' },
  { id: 'cap-cc-domains',      product: 'CertCentral', service: 'domains',      actions: ['read', 'validate'],                      description: 'Manage and validate domains' },
  { id: 'cap-cc-reports',      product: 'CertCentral', service: 'reports',      actions: ['read', 'export'],                        description: 'View and export reports' },
  { id: 'cap-cc-billing',      product: 'CertCentral', service: 'billing',      actions: ['read', 'manage'],                        description: 'Manage billing and subscriptions' },
  { id: 'cap-cc-users',        product: 'CertCentral', service: 'users',        actions: ['read', 'manage'],                        description: 'Manage account users' },
  { id: 'cap-cc-divisions',    product: 'CertCentral', service: 'divisions',    actions: ['read', 'manage'],                        description: 'Manage divisions and account structure' },

  // DigiCert DNS
  { id: 'cap-dns-zones',     product: 'DigiCert DNS', service: 'zones',     actions: ['read', 'manage'],                     description: 'Manage DNS zones' },
  { id: 'cap-dns-records',   product: 'DigiCert DNS', service: 'records',   actions: ['read', 'create', 'update', 'delete'], description: 'Manage DNS records' },
  { id: 'cap-dns-dnssec',    product: 'DigiCert DNS', service: 'dnssec',    actions: ['read', 'manage'],                     description: 'Manage DNSSEC signing' },
  { id: 'cap-dns-analytics', product: 'DigiCert DNS', service: 'analytics', actions: ['read'],                               description: 'View DNS query analytics' },

  // Software Trust
  { id: 'cap-st-signing',  product: 'Software Trust', service: 'signing',  actions: ['read', 'sign'],     description: 'Sign software artifacts' },
  { id: 'cap-st-keys',     product: 'Software Trust', service: 'keys',     actions: ['read', 'manage'],   description: 'Manage signing keys' },
  { id: 'cap-st-sbom',     product: 'Software Trust', service: 'sbom',     actions: ['read', 'publish'],  description: 'Publish and view SBOMs' },
  { id: 'cap-st-releases', product: 'Software Trust', service: 'releases', actions: ['read', 'approve'],  description: 'Approve release builds' },
  { id: 'cap-st-projects', product: 'Software Trust', service: 'projects', actions: ['read', 'manage'],   description: 'Manage projects' },

  // Trust Lifecycle
  { id: 'cap-tl-account',             product: 'Trust Lifecycle', service: 'account',             actions: ['read', 'manage'],                    description: 'Account setup and business units' },
  { id: 'cap-tl-certificate-owners',  product: 'Trust Lifecycle', service: 'certificate-owners',  actions: ['read', 'manage'],                    description: 'Certificate owners' },
  { id: 'cap-tl-self-service-portal', product: 'Trust Lifecycle', service: 'self-service-portal', actions: ['read', 'configure'],                 description: 'Self-service portal configuration' },
  { id: 'cap-tl-client-tools',        product: 'Trust Lifecycle', service: 'client-tools',        actions: ['read', 'manage'],                    description: 'Client tools and infrastructure' },
  { id: 'cap-tl-reports',             product: 'Trust Lifecycle', service: 'reports',             actions: ['read', 'manage', 'export'],          description: 'Reports and logs' },
  { id: 'cap-tl-custom-attributes',   product: 'Trust Lifecycle', service: 'custom-attributes',   actions: ['read', 'manage'],                    description: 'Custom attributes' },
  { id: 'cap-tl-connectors',          product: 'Trust Lifecycle', service: 'connectors',          actions: ['read', 'manage'],                    description: 'Account connectors' },
  { id: 'cap-tl-seats',               product: 'Trust Lifecycle', service: 'seats',               actions: ['read', 'manage'],                    description: 'Seats' },
  { id: 'cap-tl-certificate-profiles',product: 'Trust Lifecycle', service: 'certificate-profiles',actions: ['read', 'manage'],                    description: 'Certificate profiles' },
  { id: 'cap-tl-enrollments',         product: 'Trust Lifecycle', service: 'enrollments',         actions: ['read', 'manage'],                    description: 'Enrollments' },
  { id: 'cap-tl-certificates',        product: 'Trust Lifecycle', service: 'certificates',        actions: ['read', 'issue', 'revoke', 'manage'], description: 'Issued certificates' },
  { id: 'cap-tl-certificate-recovery',product: 'Trust Lifecycle', service: 'certificate-recovery',actions: ['read', 'recover'],                   description: 'Escrowed certificate recovery' },
  { id: 'cap-tl-certificate-import',  product: 'Trust Lifecycle', service: 'certificate-import',  actions: ['read', 'import'],                    description: 'Import certificates from external CAs' },
  { id: 'cap-tl-cmdb-connectors',     product: 'Trust Lifecycle', service: 'cmdb-connectors',     actions: ['read', 'manage'],                    description: 'ServiceNow CMDB connectors' },
];

const CAP_BY_ID = new Map<string, Capability>(CAPABILITIES.map((c) => [c.id, c]));

/** A capability grant; omit `actions` to grant the full action set of the capability. */
function grant(capabilityId: string, actions?: string[]): CapabilityGrant {
  const all = CAP_BY_ID.get(capabilityId)?.actions ?? [];
  return { capabilityId, actions: actions ? actions.filter((a) => all.includes(a)) : all.slice() };
}

/** Build a Built-in role from explicit capability grants. */
function roleWith(product: ProductId, name: string, description: string, capabilities: CapabilityGrant[]): Role {
  return { id: roleId(product, name), product, name, description, type: 'Built-in', capabilities };
}

/** Build a Built-in role granting the full action set of each listed capability. */
function role(product: ProductId, name: string, description: string, capabilityIds: string[]): Role {
  return roleWith(product, name, description, capabilityIds.map((id) => grant(id)));
}

// ── Built-in roles — non-modifiable, product-scoped ─────────────────────────
export const SEED_ROLES: Role[] = [
  // CertCentral — built-in roles
  role('CertCentral', 'Administrator', 'Full account access including users, divisions, billing, and all certificate operations.', ['cap-cc-certificates', 'cap-cc-orders', 'cap-cc-domains', 'cap-cc-reports', 'cap-cc-billing', 'cap-cc-users', 'cap-cc-divisions']),
  roleWith('CertCentral', 'Manager', 'Manage certificates, orders, domains, and reports across divisions.', [
    grant('cap-cc-certificates'),
    grant('cap-cc-orders'),
    grant('cap-cc-domains'),
    grant('cap-cc-reports'),
    grant('cap-cc-divisions', ['read']),
  ]),
  role('CertCentral', 'Finance Manager', 'Manage billing and payments, and view financial reports.', ['cap-cc-billing', 'cap-cc-reports']),
  role('CertCentral', 'Standard User', 'Request and manage certificates, and view domains.', ['cap-cc-certificates', 'cap-cc-domains']),
  roleWith('CertCentral', 'Limited User', 'Request certificates that require administrator approval.', [
    grant('cap-cc-certificates', ['read', 'request']),
    grant('cap-cc-domains', ['read']),
  ]),

  // DigiCert DNS — built-in roles
  role('DigiCert DNS', 'Administrator', 'Full access to zones, records, DNSSEC, and analytics.', ['cap-dns-zones', 'cap-dns-records', 'cap-dns-dnssec', 'cap-dns-analytics']),
  roleWith('DigiCert DNS', 'Manager', 'Manage DNS records and DNSSEC within existing zones.', [
    grant('cap-dns-zones', ['read']),
    grant('cap-dns-records'),
    grant('cap-dns-dnssec'),
    grant('cap-dns-analytics', ['read']),
  ]),
  roleWith('DigiCert DNS', 'Viewer', 'Read-only access to zones, records, and analytics.', [
    grant('cap-dns-zones', ['read']),
    grant('cap-dns-records', ['read']),
    grant('cap-dns-dnssec', ['read']),
    grant('cap-dns-analytics', ['read']),
  ]),

  // Software Trust — built-in roles
  role('Software Trust', 'Administrator', 'Full access to all Software Trust capabilities.', ['cap-st-signing', 'cap-st-keys', 'cap-st-sbom', 'cap-st-releases', 'cap-st-projects']),
  roleWith('Software Trust', 'Manager', 'Manage projects, releases, SBOMs, and signing keys.', [
    grant('cap-st-projects'),
    grant('cap-st-releases'),
    grant('cap-st-sbom'),
    grant('cap-st-keys', ['read']),
    grant('cap-st-signing', ['read']),
  ]),
  roleWith('Software Trust', 'Key manager', 'Manage signing keys.', [
    grant('cap-st-keys'),
    grant('cap-st-signing', ['read']),
  ]),
  role('Software Trust', 'Signer', 'Sign software artifacts.', ['cap-st-signing']),
  roleWith('Software Trust', 'Auditor', 'Read-only access to signing activity, SBOMs, and releases.', [
    grant('cap-st-signing', ['read']),
    grant('cap-st-keys', ['read']),
    grant('cap-st-sbom', ['read']),
    grant('cap-st-releases', ['read']),
    grant('cap-st-projects', ['read']),
  ]),

  // Trust Lifecycle — built-in roles
  roleWith('Trust Lifecycle', 'Certificate owners manager', 'View and manage certificate owners.', [
    grant('cap-tl-certificate-owners'),
  ]),
  roleWith('Trust Lifecycle', 'SSP Manager', 'Configure the self-service portal.', [
    grant('cap-tl-self-service-portal'),
  ]),
  roleWith('Trust Lifecycle', 'View only', 'Read-only access to account data.', [
    grant('cap-tl-account', ['read']),
    grant('cap-tl-seats', ['read']),
    grant('cap-tl-certificate-profiles', ['read']),
    grant('cap-tl-enrollments', ['read']),
    grant('cap-tl-certificates', ['read']),
    grant('cap-tl-reports', ['read']),
    grant('cap-tl-custom-attributes', ['read']),
    grant('cap-tl-certificate-owners', ['read']),
  ]),
  roleWith('Trust Lifecycle', 'Infrastructure admin', 'View and manage client tools.', [
    grant('cap-tl-client-tools'),
  ]),
  roleWith('Trust Lifecycle', 'Reporting admin', 'View and manage reports.', [
    grant('cap-tl-reports'),
  ]),
  roleWith('Trust Lifecycle', 'Custom attribute manager', 'View and manage custom attributes.', [
    grant('cap-tl-custom-attributes'),
  ]),
  roleWith(
    'Trust Lifecycle',
    'Manager',
    'Manage account setup (including business units, connectors, and seats), inventory (including certificate profiles, enrollments, and certificates), and reports/logs.',
    [
      grant('cap-tl-account'),
      grant('cap-tl-connectors'),
      grant('cap-tl-seats'),
      grant('cap-tl-certificate-profiles'),
      grant('cap-tl-enrollments'),
      grant('cap-tl-certificates'),
      grant('cap-tl-reports'),
    ],
  ),
  roleWith('Trust Lifecycle', 'Recovery manager', 'Recover escrowed certificates.', [
    grant('cap-tl-certificate-recovery'),
  ]),
  roleWith('Trust Lifecycle', 'Import manager', 'Import certificates from external CAs.', [
    grant('cap-tl-certificate-import'),
  ]),
  roleWith('Trust Lifecycle', 'User and certificate manager', 'Manage seats, enrollments, certificates, and reports.', [
    grant('cap-tl-seats'),
    grant('cap-tl-enrollments'),
    grant('cap-tl-certificates'),
    grant('cap-tl-reports'),
  ]),
  roleWith('Trust Lifecycle', 'Certificate profile manager', 'Manage certificate profiles.', [
    grant('cap-tl-certificate-profiles'),
  ]),
  roleWith('Trust Lifecycle', 'CMDB Integration Config Manager', 'Add and manage ServiceNow CMDB connectors.', [
    grant('cap-tl-cmdb-connectors'),
  ]),
];

/**
 * The product-native partition that *also groups users* for each product
 * (the overloaded "scope == group" construct). A scope whose `kind` matches
 * its product's partition kind is both a resource scope and a principal group;
 * `withPartitionOrigin` stamps it with a `ProductOrigin` so `productGroupsFromScopes`
 * can materialize the linked group. Products absent here (e.g. DigiCert DNS) have
 * scopes that do not group users — they stay scope-only.
 */
export const PARTITION_KIND: Partial<Record<ProductId, string>> = {
  'CertCentral': 'Division',
  'Software Trust': 'Team',
  'Trust Lifecycle': 'Business Unit',
};

/** Stamp a `ProductOrigin` on a scope when its kind is its product's user-grouping partition. */
function withPartitionOrigin(s: Scope): Scope {
  return s.kind === PARTITION_KIND[s.product]
    ? { ...s, origin: { product: s.product, kind: s.kind, externalId: s.id } }
    : s;
}

const RAW_SCOPES: Scope[] = [
  // CertCentral
  { id: 'sc-cc-1', product: 'CertCentral', name: 'Engineering Division',     kind: 'Division' },
  { id: 'sc-cc-2', product: 'CertCentral', name: 'Sales & Marketing',        kind: 'Division' },
  { id: 'sc-cc-3', product: 'CertCentral', name: 'Finance Division',         kind: 'Division' },
  { id: 'sc-cc-4', product: 'CertCentral', name: 'IT Operations',            kind: 'Division' },
  { id: 'sc-cc-5', product: 'CertCentral', name: 'Production Sub-Account',   kind: 'Sub-Account' },
  { id: 'sc-cc-6', product: 'CertCentral', name: 'Staging Sub-Account',      kind: 'Sub-Account' },

  // DigiCert DNS — DNS zones scope resources but do not group users (no partition kind).
  { id: 'sc-dns-1', product: 'DigiCert DNS', name: 'acme.com',               kind: 'DNS Zone' },
  { id: 'sc-dns-2', product: 'DigiCert DNS', name: 'acme.io',                kind: 'DNS Zone' },
  { id: 'sc-dns-3', product: 'DigiCert DNS', name: 'internal.acme.local',    kind: 'DNS Zone' },
  { id: 'sc-dns-4', product: 'DigiCert DNS', name: 'staging.acme.com',       kind: 'DNS Zone' },

  // Software Trust — Teams are the user-grouping partition; Projects are resources within them.
  { id: 'sc-st-team-1', product: 'Software Trust', name: 'Platform Team',    kind: 'Team' },
  { id: 'sc-st-team-2', product: 'Software Trust', name: 'Mobile Team',      kind: 'Team' },
  { id: 'sc-st-1', product: 'Software Trust', name: 'Mobile App Project',    kind: 'Project' },
  { id: 'sc-st-2', product: 'Software Trust', name: 'Backend Services',      kind: 'Project' },
  { id: 'sc-st-3', product: 'Software Trust', name: 'Desktop Client',        kind: 'Project' },
  { id: 'sc-st-4', product: 'Software Trust', name: 'Firmware Releases',     kind: 'Project' },
  { id: 'sc-st-5', product: 'Software Trust', name: 'CLI Tools',             kind: 'Project' },

  // Trust Lifecycle — Business Units are the user-grouping partition; CA accounts/profiles are resources within them.
  { id: 'sc-tl-bu-1', product: 'Trust Lifecycle', name: 'Corporate IT',       kind: 'Business Unit' },
  { id: 'sc-tl-bu-2', product: 'Trust Lifecycle', name: 'Manufacturing',      kind: 'Business Unit' },
  { id: 'sc-tl-1', product: 'Trust Lifecycle', name: 'Production CA',         kind: 'CA Account' },
  { id: 'sc-tl-2', product: 'Trust Lifecycle', name: 'Development CA',        kind: 'CA Account' },
  { id: 'sc-tl-3', product: 'Trust Lifecycle', name: 'IoT Device Profile',    kind: 'Profile' },
  { id: 'sc-tl-4', product: 'Trust Lifecycle', name: 'Workforce SSO Profile', kind: 'Profile' },
];

export const SCOPES: Scope[] = RAW_SCOPES.map(withPartitionOrigin);

/** Deterministic id for the group facet of a partition scope. */
export function partitionGroupId(scopeId: string): string {
  return `g-${scopeId}`;
}

/**
 * Deterministic member set for a partition (no RNG, so the seed is stable across reloads).
 * Picks a rotating window of users keyed off the partition's position.
 */
function partitionMembers(users: User[], index: number): PrincipalRef[] {
  if (users.length === 0) return [];
  const size = Math.min(3, users.length);
  return Array.from({ length: size }, (_, k) => users[(index * 2 + k) % users.length]).map(
    (u) => ({ type: 'user' as const, id: u.id }),
  );
}

/**
 * Sync routine: for every scope that is a product partition (has a `ProductOrigin`),
 * materialize its membership facet as a `source: 'Product'` Group sharing that origin.
 * This is the generalization of the hand-wired CertCentral Division example to all
 * products' partitions. DNS zones produce no groups (scope-only).
 */
export function productGroupsFromScopes(scopes: Scope[], users: User[]): Group[] {
  return scopes
    .filter((s) => s.origin)
    .map((s, i) => {
      const members = partitionMembers(users, i);
      return {
        id: partitionGroupId(s.id),
        name: `${s.product} · ${s.name}`,
        memberCount: members.length,
        source: 'Product' as const,
        origin: s.origin,
        members,
      };
    });
}
