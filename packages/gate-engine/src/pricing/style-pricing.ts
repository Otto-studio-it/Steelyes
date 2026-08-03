import type { GateConfig, GateStyle, GateType } from '../types'

type StylePricingBaseEntry = {
  manualGbp: number
  autoGbp: number | null
}

export type StyleBasePriceSource = 'baseline' | 'style_override' | 'shared_equal'

export type StyleBasePriceResolution = {
  manualGbp: number | null
  autoGbp: number | null
  style: GateStyle
  source: StyleBasePriceSource
  confirmed: boolean
  note: string
}

type StyleBaseOverride = {
  manualGbp?: number | null
  autoGbp?: number | null
  confirmed: boolean
  note: string
}

/**
 * Client-confirmed style-specific base price differences only.
 * Do not add speculative overrides — see CLIENT_GATE_REQUIREMENTS_REFERENCE.md.
 */
const STYLE_BASE_OVERRIDES: Partial<Record<GateType, Partial<Record<GateStyle, StyleBaseOverride>>>> = {
  single_swing: {
    composite_boards: {
      manualGbp: 750,
      confirmed: true,
      note: 'Composite boards manual base is GBP 750 (traditional Victorian is GBP 850 for this gate type).',
    },
  },
}

/**
 * Gate types where the client reference lists equal manual/auto base prices
 * for composite boards and traditional Victorian.
 */
const SHARED_EQUAL_COMPOSITE_GATE_TYPES = new Set<GateType>([
  'double_swing',
  'tracked_sliding',
  'cantilever_sliding',
  'bifolding_double_swing',
  'single_bifolding',
  'telescopic_sliding',
  'radius_sliding',
])

export function resolveStyleAwareBasePrice(
  config: GateConfig,
  entry: StylePricingBaseEntry,
): StyleBasePriceResolution {
  const override = STYLE_BASE_OVERRIDES[config.gateType]?.[config.style]

  if (override) {
    return {
      manualGbp: override.manualGbp ?? entry.manualGbp,
      autoGbp: override.autoGbp ?? entry.autoGbp,
      style: config.style,
      source: 'style_override',
      confirmed: override.confirmed,
      note: override.note,
    }
  }

  if (config.style === 'composite_boards') {
    const sharedEqual = SHARED_EQUAL_COMPOSITE_GATE_TYPES.has(config.gateType)

    return {
      manualGbp: entry.manualGbp,
      autoGbp: entry.autoGbp,
      style: config.style,
      source: 'shared_equal',
      confirmed: sharedEqual,
      note: sharedEqual
        ? 'Composite boards base price matches traditional Victorian for this gate type (client reference).'
        : 'Composite boards base price for this gate type is not yet confirmed by the client.',
    }
  }

  return {
    manualGbp: entry.manualGbp,
    autoGbp: entry.autoGbp,
    style: config.style,
    source: 'baseline',
    confirmed: true,
    note: 'Traditional Victorian base price from catalogue.',
  }
}

export function stylePricingAssumption(resolution: StyleBasePriceResolution): string | null {
  if (resolution.source === 'baseline') {
    return null
  }

  if (!resolution.confirmed) {
    return resolution.note
  }

  return resolution.note
}

export function stylePricingSummary(config: GateConfig): {
  style: GateStyle
  hasStyleSpecificBase: boolean
  confirmed: boolean
} {
  return {
    style: config.style,
    hasStyleSpecificBase: config.style === 'composite_boards',
    confirmed:
      config.style === 'traditional_victorian' ||
      Boolean(STYLE_BASE_OVERRIDES[config.gateType]?.[config.style]?.confirmed) ||
      SHARED_EQUAL_COMPOSITE_GATE_TYPES.has(config.gateType),
  }
}
