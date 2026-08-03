import {
  DEFAULT_PRICING_CATALOG,
  FINISH_CODES,
  GATE_TYPES,
  createDefaultTenantFeatures,
  type TenantBundle,
} from '@steelyes/gate-engine'

import steelyesTenant from '@/data/tenants/steelyes.json'

const TENANT_REGISTRY: Record<string, Partial<TenantBundle>> = {
  steelyes: steelyesTenant as Partial<TenantBundle>,
}

export function loadTenantBundle(tenantId: string): TenantBundle | null {
  const partial = TENANT_REGISTRY[tenantId]
  if (!partial) {
    return null
  }

  return {
    id: partial.id ?? tenantId,
    branding: partial.branding ?? {
      companyName: 'Steelyes',
      primaryColor: '#9E000C',
      accentColor: '#1B1C1A',
    },
    locale: partial.locale ?? 'en-GB',
    currency: partial.currency ?? 'GBP',
    catalog: partial.catalog ?? DEFAULT_PRICING_CATALOG,
    enabledGateTypes: partial.enabledGateTypes ?? [...GATE_TYPES],
    enabledFinishes: partial.enabledFinishes ?? [...FINISH_CODES],
    features: {
      ...createDefaultTenantFeatures(),
      ...partial.features,
    },
    leads: partial.leads ?? {
      email: 'info@steelyes.co.uk',
    },
  }
}

export function resolveTenantId(value: string | null | undefined): string {
  if (value && TENANT_REGISTRY[value]) {
    return value
  }
  return 'steelyes'
}
