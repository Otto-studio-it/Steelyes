import type { PricingCatalog } from '../pricing'
import type { FinishCode, GateType } from '../types'

export type TenantBranding = {
  logoUrl?: string
  primaryColor: string
  accentColor: string
  companyName: string
}

export type TenantLeadRouting = {
  email: string
  webhookUrl?: string
}

export type TenantFeatureFlags = {
  enable3d: boolean
  enablePlanView: boolean
  enablePhotoOverlay: boolean
  enableFencePanels: boolean
  enableMotorCatalog: boolean
}

export type TenantBundle = {
  id: string
  branding: TenantBranding
  locale: 'en-GB' | 'it-IT'
  currency: 'GBP' | 'EUR'
  catalog: PricingCatalog
  enabledGateTypes: GateType[]
  enabledFinishes: FinishCode[]
  features: TenantFeatureFlags
  leads: TenantLeadRouting
}

export const STEELYES_TENANT_ID = 'steelyes'

export function createDefaultTenantFeatures(): TenantFeatureFlags {
  return {
    enable3d: true,
    enablePlanView: true,
    enablePhotoOverlay: true,
    enableFencePanels: true,
    enableMotorCatalog: true,
  }
}
