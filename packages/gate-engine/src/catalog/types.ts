import type { GateOptionKey, GateStyle, GateType } from '../types'

export type VariantCatalogStatus = 'blocked_pending_client' | 'provisional' | 'confirmed'

export type VariantEntryStatus = 'provisional' | 'confirmed'

export type RailheadOptionKey = Extract<GateOptionKey, 'top_railheads' | 'dog_bar_railheads'>

export const RAILHEAD_OPTION_KEYS = ['top_railheads', 'dog_bar_railheads'] as const satisfies readonly RailheadOptionKey[]

export type VariantAppliesTo = {
  styles?: GateStyle[]
  gateTypes?: GateType[]
  minWidthMm?: number
  maxWidthMm?: number
}

export type RailheadVariantDefinition = {
  slug: string
  label: string
  status: VariantEntryStatus
  optionKey: RailheadOptionKey
  unitPriceGbp: number | null
  appliesTo: VariantAppliesTo
  notes: string
  adminSlug?: string
}

export type RailheadVariantCatalog = {
  status: VariantCatalogStatus
  blockedReason: string
  owner: string
  entries: RailheadVariantDefinition[]
}

export function isRailheadOptionKey(key: GateOptionKey): key is RailheadOptionKey {
  return (RAILHEAD_OPTION_KEYS as readonly GateOptionKey[]).includes(key)
}
