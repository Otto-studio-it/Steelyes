import {
  DEFAULT_PRICING_CATALOG,
  GATE_OPTION_KEYS,
  GATE_TYPES,
} from '@steelyes/gate-engine'
import type { GateOptionKey, GateType, OptionPricingEntry, PricingCatalog } from '@steelyes/gate-engine'

import { mapGateTypeToDb } from './db-map'

/**
 * Minimal projection of a `public.gates` row used for pricing.
 * `finish` is the DB column distinguishing 'metal' (Victorian baseline)
 * from 'composite'; the engine handles style overrides separately, so the
 * catalogue base prices are taken from the 'metal' rows.
 */
export type GatePricingRow = {
  type: string
  finish: string | null
  base_price_manual_gbp: number | string | null
  base_price_auto_gbp: number | string | null
}

export type GateOptionPricingRow = {
  slug: string
  flat_price_gbp: number | string
  per_unit_price_gbp: number | string | null
  notes: string | null
}

const SLUG_TO_OPTION_KEY: Record<string, GateOptionKey> = {
  'middle-bar': 'middle_bar',
  'railheads-top': 'top_railheads',
  'dog-bars': 'dog_bars',
  'railheads-dog-bars': 'dog_bar_railheads',
  'arch-bow-top': 'arched_top',
  circles: 'circles',
  'picket-collars': 'picket_collars',
  bushes: 'bushes',
  spirals: 'spirals',
}

function toPositiveNumber(value: number | string | null): number | null {
  if (value === null) return null
  const parsed = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function toNonNegativeNumber(value: number | string | null): number {
  if (value === null) return 0
  const parsed = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return parsed
}

/**
 * Maps an admin `gate_options` row to an engine option pricing entry.
 * Unknown slugs (e.g. legacy `circles`) are ignored.
 */
export function mapGateOptionRowToPricingEntry(row: GateOptionPricingRow): {
  key: GateOptionKey
  entry: OptionPricingEntry
} | null {
  const key = SLUG_TO_OPTION_KEY[row.slug]
  if (!key) return null

  const flatGbp = toNonNegativeNumber(row.flat_price_gbp)
  const unitGbp = row.per_unit_price_gbp === null ? null : toPositiveNumber(row.per_unit_price_gbp)
  const note = row.notes?.trim() || DEFAULT_PRICING_CATALOG.optionPrices[key].note

  if (unitGbp !== null && flatGbp > 0) {
    return {
      key,
      entry: {
        kind: 'flat_plus_units',
        flatGbp,
        unitGbp,
        provisional: false,
        note,
      },
    }
  }

  if (unitGbp !== null) {
    return {
      key,
      entry: {
        kind: 'per_unit',
        unitGbp,
        provisional: false,
        note,
      },
    }
  }

  if (flatGbp > 0) {
    return {
      key,
      entry: {
        kind: 'flat',
        flatGbp,
        provisional: false,
        note,
      },
    }
  }

  return {
    key,
    entry: {
      kind: 'per_unit',
      unitGbp: null,
      provisional: true,
      note,
    },
  }
}

/**
 * Builds the engine pricing catalog from admin-managed DB rows.
 *
 * Per docs/db/PRICING_SEMANTICS.md `public.gates` is the source of truth for
 * base prices and `public.gate_options` for decorative add-ons. Reference sizes
 * and size-step uplifts are not modelled in the DB yet, so they always come
 * from the engine default catalog.
 */
export function buildPricingCatalogFromGateRows(rows: GatePricingRow[]): PricingCatalog {
  const basePrices = { ...DEFAULT_PRICING_CATALOG.basePrices }

  for (const gateType of GATE_TYPES) {
    const dbType = mapGateTypeToDb(gateType as GateType)
    const row = rows.find((candidate) => candidate.type === dbType && candidate.finish === 'metal')
    if (!row) continue

    const manualGbp = toPositiveNumber(row.base_price_manual_gbp)
    if (manualGbp === null) continue

    basePrices[gateType] = {
      ...basePrices[gateType],
      manualGbp,
      autoGbp: toPositiveNumber(row.base_price_auto_gbp),
    }
  }

  return {
    ...DEFAULT_PRICING_CATALOG,
    basePrices,
  }
}

export function mergeOptionRowsIntoCatalog(
  catalog: PricingCatalog,
  optionRows: GateOptionPricingRow[],
): PricingCatalog {
  const optionPrices = { ...catalog.optionPrices }

  for (const row of optionRows) {
    const mapped = mapGateOptionRowToPricingEntry(row)
    if (mapped) {
      optionPrices[mapped.key] = mapped.entry
    }
  }

  for (const key of GATE_OPTION_KEYS) {
    if (!(key in optionPrices)) {
      optionPrices[key] = DEFAULT_PRICING_CATALOG.optionPrices[key]
    }
  }

  return {
    ...catalog,
    optionPrices,
  }
}

export function buildPricingCatalogFromDbRows(
  gateRows: GatePricingRow[],
  optionRows: GateOptionPricingRow[] = [],
): PricingCatalog {
  const baseCatalog = buildPricingCatalogFromGateRows(gateRows)
  return mergeOptionRowsIntoCatalog(baseCatalog, optionRows)
}
