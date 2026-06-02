export type UserStatus = 'Active' | 'Pending' | 'Revoked';
export type ServiceUserStatus = 'Active' | 'Revoked';
export type SourceType = 'Manual' | 'IDP';
export type PrincipalType = 'user' | 'service_user' | 'group';
export type ProductId =
  | 'CertCentral'
  | 'DigiCert DNS'
  | 'Software Trust'
  | 'Trust Lifecycle';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  status: UserStatus;
  type: SourceType;
  lastActive: string | null;
}

export interface ServiceUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  status: ServiceUserStatus;
  type: SourceType;
  lastActive: string | null;
}

/**
 * Provenance for an object imported from a product's native partition
 * (e.g. a CertCentral Division, a Software Trust Team, a TLM Business Unit).
 *
 * Products overload one construct to mean both a *scope* (the resource
 * partition) and a *principal group* (its member users). The console
 * normalizes that into separate Scope and Group objects; a shared
 * `ProductOrigin` (same `product` + `externalId`) links the two facets
 * back to the single product partition they came from.
 */
export interface ProductOrigin {
  product: ProductId;
  kind: string;        // the product's term for its partition, e.g. "Division", "Team", "Business Unit"
  externalId: string;  // the product's id for the partition
}

export type GroupSource = 'IDP' | 'Product';

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  source: GroupSource;
  externalId?: string;        // IDP/SCIM external id (when source === 'IDP')
  origin?: ProductOrigin;     // product partition this group is the membership facet of (when source === 'Product')
  members?: PrincipalRef[];   // explicit membership, when known
}

export interface Scope {
  id: string;
  product: ProductId;
  name: string;
  kind: string;
  origin?: ProductOrigin;     // product partition this scope is the resource facet of
}

export type RoleType = 'Built-in' | 'Custom';

/**
 * A capability describes what can be accessed and which actions are permissible,
 * in the architecture's `service_endpoint(s)_action(s)` form.
 */
export interface Capability {
  id: string;
  product: ProductId;
  service: string;     // service endpoint, e.g. "certificates"
  actions: string[];   // permissible actions, e.g. ["read", "issue", "revoke"]
  description: string;
}

/** A capability granted to a role, narrowed to a chosen subset of its actions. */
export interface CapabilityGrant {
  capabilityId: string;
  actions: string[];   // subset of the capability's available actions
}

/** A role is a product-scoped container of capability grants. */
export interface Role {
  id: string;
  product: ProductId;
  name: string;
  description: string;
  type: RoleType;          // Built-in = non-modifiable; Custom = user-defined
  capabilities: CapabilityGrant[];
}

export type ConditionOperator = 'equals' | 'not_equals' | 'in' | 'exists';

/** A single contextual condition gating when an assignment is active. */
export interface AssignmentCondition {
  id: string;
  attribute: string;   // e.g. "ticket.status", "request.environment", "principal.shift"
  operator: ConditionOperator;
  value: string;       // for "in", a comma-separated list; ignored for "exists"
}

/**
 * Rule-based activation for an assignment: an optional active window plus
 * contextual conditions (all must hold) describing when the grant applies.
 */
export interface AssignmentActivation {
  validFrom: string | null;   // ISO date, or null for "no start bound"
  validUntil: string | null;  // ISO date, or null for "no end bound"
  conditions: AssignmentCondition[];
}

export interface Assignment {
  id: string;
  principalType: PrincipalType;
  principalId: string;
  product: ProductId;
  roleIds: string[];          // one or more roles (all product-scoped)
  scopeIds: string[];
  activation: AssignmentActivation;
  createdAt: string;
}

export interface Product {
  id: ProductId;
  name: string;
  description: string;
}

export interface PrincipalRef {
  type: PrincipalType;
  id: string;
}

export type Principal = User | ServiceUser | Group;

export interface IdpSyncCandidate {
  username: string;
  name: string;
  email: string;
}
