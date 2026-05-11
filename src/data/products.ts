import type { Product, ProductId, Scope } from '@/types';

export const PRODUCTS: Product[] = [
  { id: 'CertCentral',     name: 'CertCentral',     description: 'Public TLS certificate lifecycle' },
  { id: 'DigiCert DNS',    name: 'DigiCert DNS',    description: 'Authoritative DNS management' },
  { id: 'Software Trust',  name: 'Software Trust',  description: 'Code signing & SBOM management' },
  { id: 'Trust Lifecycle', name: 'Trust Lifecycle', description: 'Enterprise PKI & private trust' },
];

export const ROLES_BY_PRODUCT: Record<ProductId, string[]> = {
  'CertCentral':     ['Administrator', 'Manager', 'Finance Manager', 'Standard User'],
  'Software Trust':  ['Lead', 'Team Lead', 'Developer', 'Build Engineer', 'Signer'],
  'Trust Lifecycle': ['Manager', 'Infrastructure Admin', 'Reporting Admin', 'Integrations Admin', 'Certificate Manager', 'Viewer'],
  'DigiCert DNS':    ['Administrator', 'Viewer'],
};

export const SCOPES: Scope[] = [
  // CertCentral
  { id: 'sc-cc-1', product: 'CertCentral', name: 'Engineering Division',     kind: 'Division' },
  { id: 'sc-cc-2', product: 'CertCentral', name: 'Sales & Marketing',        kind: 'Division' },
  { id: 'sc-cc-3', product: 'CertCentral', name: 'Finance Division',         kind: 'Division' },
  { id: 'sc-cc-4', product: 'CertCentral', name: 'IT Operations',            kind: 'Division' },
  { id: 'sc-cc-5', product: 'CertCentral', name: 'Production Sub-Account',   kind: 'Sub-Account' },
  { id: 'sc-cc-6', product: 'CertCentral', name: 'Staging Sub-Account',      kind: 'Sub-Account' },

  // DigiCert DNS
  { id: 'sc-dns-1', product: 'DigiCert DNS', name: 'acme.com',               kind: 'DNS Zone' },
  { id: 'sc-dns-2', product: 'DigiCert DNS', name: 'acme.io',                kind: 'DNS Zone' },
  { id: 'sc-dns-3', product: 'DigiCert DNS', name: 'internal.acme.local',    kind: 'DNS Zone' },
  { id: 'sc-dns-4', product: 'DigiCert DNS', name: 'staging.acme.com',       kind: 'DNS Zone' },

  // Software Trust
  { id: 'sc-st-1', product: 'Software Trust', name: 'Mobile App Project',    kind: 'Project' },
  { id: 'sc-st-2', product: 'Software Trust', name: 'Backend Services',      kind: 'Project' },
  { id: 'sc-st-3', product: 'Software Trust', name: 'Desktop Client',        kind: 'Project' },
  { id: 'sc-st-4', product: 'Software Trust', name: 'Firmware Releases',     kind: 'Project' },
  { id: 'sc-st-5', product: 'Software Trust', name: 'CLI Tools',             kind: 'Project' },

  // Trust Lifecycle
  { id: 'sc-tl-1', product: 'Trust Lifecycle', name: 'Production CA',         kind: 'CA Account' },
  { id: 'sc-tl-2', product: 'Trust Lifecycle', name: 'Development CA',        kind: 'CA Account' },
  { id: 'sc-tl-3', product: 'Trust Lifecycle', name: 'IoT Device Profile',    kind: 'Profile' },
  { id: 'sc-tl-4', product: 'Trust Lifecycle', name: 'Workforce SSO Profile', kind: 'Profile' },
];
