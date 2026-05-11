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

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  source: 'IDP';
  externalId?: string;
}

export interface Scope {
  id: string;
  product: ProductId;
  name: string;
  kind: string;
}

export interface Assignment {
  id: string;
  principalType: PrincipalType;
  principalId: string;
  product: ProductId;
  role: string;
  scopeIds: string[];
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
