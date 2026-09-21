import {
  DEFAULT_RAILHEAD_VARIANT_CATALOG,
  isRailheadOptionKey,
  resolveRailheadVariantPricing,
} from './catalog'
import type { RailheadVariantCatalog } from './catalog'
import {
  resolveStyleAwareBasePrice,
  stylePricingAssumption,
} from './pricing/style-pricing'
import {
  SIZE_UPLIFT_HEIGHT_GBP,
  SIZE_UPLIFT_HEIGHT_STEP_MM,
  SIZE_UPLIFT_WIDTH_GBP,
  SIZE_UPLIFT_WIDTH_STEP_MM,
  SHIP_RAILHEAD_UNIT_GBP,
  aluminiumUpgradeGbp,
} from './rules/ship-defaults'
import {
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from './types'
import {
  normalizeGateConfig,
  validateGateConfig,
  validateGateConfigDraftInput,
  type ValidationIssue,
} from './validation'

export type PricingCurrency = 'GBP'

export type PricingStatus = 'indicative' | 'survey_required'

export type PricingSource = 'manual' | 'auto'

export type PricingLineItem = {
  code: string
  label: string
  kind: 'base' | 'size' | 'option'
  amountGbp: number | null
  provisional: boolean
  note?: string
}

export type PricingIssue = ValidationIssue

export type GateBasePriceEntry = {
  manualGbp: number
  autoGbp: number | null
  referenceWidthMm: number
  referenceHeightMm: number
  /** GBP charged per widthStepMm above reference. */
  widthStepGbp: number
  /** Band size in mm for width uplift (intake: 200). */
  widthStepMm: number
  /** GBP charged per heightStepMm above reference. */
  heightStepGbp: number
  /** Band size in mm for height uplift (intake: 100). */
  heightStepMm: number
}

export type OptionPricingEntry =
  | {
      kind: 'flat'
      flatGbp: number
      provisional: boolean
      note: string
    }
  | {
      kind: 'per_unit'
      unitGbp: number | null
      provisional: boolean
      note: string
    }
  | {
      kind: 'flat_plus_units'
      flatGbp: number
      unitGbp: number
      provisional: boolean
      note: string
    }

export type PricingCatalog = {
  basePrices: Record<GateType, GateBasePriceEntry>
  optionPrices: Record<GateOptionKey, OptionPricingEntry>
}

export type PricingResult = {
  currency: PricingCurrency
  status: PricingStatus
  source: PricingSource
  basePriceGbp: number | null
  subtotalKnownGbp: number
  totalGbp: number | null
  totalLabel: string
  disclaimer: string
  breakdown: PricingLineItem[]
  missingData: string[]
  assumptions: string[]
  issues: PricingIssue[]
  /** Mirrors GateConfig.siteSurveyRequested so every pricing surface can show it. */
  siteSurveyRequested: boolean
}

export type BasePricingResult = {
  source: PricingSource
  amountGbp: number | null
  lineItem: PricingLineItem
  missingData: string[]
  note: string
}

export type OptionPricingResult = {
  items: PricingLineItem[]
  missingData: string[]
}

const DEFAULT_DISCLAIMER = 'Estimated, subject to survey'
const SITE_SURVEY_ASSUMPTION = 'Customer requested a site survey; the final quote follows the survey.'
const SUPPLY_ONLY_ASSUMPTION =
  'Supply only: estimate is fabrication only. Installation is not included and is not priced here.'

/**
 * Catalogue FROM prices — intake PDF 2026-07-26 (client corrections applied).
 * Size uplift: +£50 / 200 mm width, +£50 / 100 mm height above band top (all types).
 */
export const DEFAULT_PRICING_CATALOG: PricingCatalog = {
  basePrices: {
    double_swing: {
      manualGbp: 1900,
      autoGbp: 3800,
      referenceWidthMm: 1900,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    single_swing: {
      manualGbp: 850,
      autoGbp: 2700,
      referenceWidthMm: 900,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    tracked_sliding: {
      manualGbp: 2400,
      autoGbp: 3600,
      referenceWidthMm: 2600,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    cantilever_sliding: {
      manualGbp: 2900,
      autoGbp: 4200,
      referenceWidthMm: 2600,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    bifolding_double_swing: {
      manualGbp: 2700,
      autoGbp: 4200,
      referenceWidthMm: 3000,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    single_bifolding: {
      manualGbp: 2000,
      autoGbp: 3200,
      referenceWidthMm: 1600,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    telescopic_sliding: {
      manualGbp: 3100,
      autoGbp: 4200,
      referenceWidthMm: 2100,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
    radius_sliding: {
      manualGbp: 2700,
      autoGbp: 4200,
      referenceWidthMm: 1700,
      referenceHeightMm: 1000,
      widthStepGbp: SIZE_UPLIFT_WIDTH_GBP,
      widthStepMm: SIZE_UPLIFT_WIDTH_STEP_MM,
      heightStepGbp: SIZE_UPLIFT_HEIGHT_GBP,
      heightStepMm: SIZE_UPLIFT_HEIGHT_STEP_MM,
    },
  },
  optionPrices: {
    middle_bar: {
      kind: 'flat',
      flatGbp: 275,
      provisional: false,
      note: 'Intake-confirmed middle bar.',
    },
    top_railheads: {
      kind: 'per_unit',
      unitGbp: SHIP_RAILHEAD_UNIT_GBP,
      provisional: true,
      note: `Ship mid-band £${SHIP_RAILHEAD_UNIT_GBP} / pc until railhead SKU catalog confirmed (intake £1.25–£25).`,
    },
    dog_bars: {
      kind: 'flat',
      flatGbp: 75,
      provisional: false,
      note: 'Intake dog bars base £75 — per-bar extra dropped (width uplift covers growth).',
    },
    dog_bar_railheads: {
      kind: 'per_unit',
      unitGbp: SHIP_RAILHEAD_UNIT_GBP,
      provisional: true,
      note: `Ship mid-band £${SHIP_RAILHEAD_UNIT_GBP} / pc until railhead SKU catalog confirmed.`,
    },
    arched_top: {
      kind: 'flat',
      flatGbp: 850,
      provisional: false,
      note: 'Intake-confirmed arched top (all gate types).',
    },
    circles: {
      kind: 'flat_plus_units',
      flatGbp: 275,
      unitGbp: 2.5,
      provisional: true,
      note: 'CA-16 / Q1: upper+lower together. Marius: +£275 rail + £2.50/circle; qty auto per bay (survey).',
    },
    picket_collars: {
      kind: 'flat',
      flatGbp: 95,
      provisional: true,
      note: 'Q2–Q4: collar/boss on long pickets only (every 1 or 2). Mid-height. £ TBD — provisional flat.',
    },
    bushes: {
      kind: 'per_unit',
      unitGbp: 2.5,
      provisional: true,
      note: 'Intake minimum £2.50 / bush (setup £90 not yet modelled as separate line).',
    },
    spirals: {
      kind: 'per_unit',
      unitGbp: 3.8,
      provisional: false,
      note: 'Intake minimum £3.80 / spiral.',
    },
    aluminium_panels: {
      kind: 'flat',
      flatGbp: 0,
      provisional: true,
      note: 'Computed from ship-defaults aluminium formula when enabled on composite.',
    },
  },
}

function roundPounds(value: number): number {
  return Math.round(value)
}

function formatMoney(value: number): string {
  return `£${roundPounds(value).toLocaleString('en-GB')}`
}

function formatOptionLabel(key: GateOptionKey): string {
  return key.split('_').join(' ')
}

function getBasePriceSource(
  config: GateConfig,
  catalog: PricingCatalog,
): {
  amount: number | null
  source: PricingSource
  missingData: string[]
  note: string
  styleNote: string
  styleConfirmed: boolean
} {
  const entry = catalog.basePrices[config.gateType]
  const styleResolution = resolveStyleAwareBasePrice(config, entry)

  if (config.motorised) {
    if (styleResolution.autoGbp === null) {
      return {
        amount: null,
        source: 'auto',
        missingData: ['base_price_auto_gbp'],
        note: 'Motorised base price is still required for this gate type.',
        styleNote: styleResolution.note,
        styleConfirmed: styleResolution.confirmed,
      }
    }

    return {
      amount: styleResolution.autoGbp,
      source: 'auto',
      missingData: [],
      note: styleResolution.note,
      styleNote: styleResolution.note,
      styleConfirmed: styleResolution.confirmed,
    }
  }

  if (styleResolution.manualGbp === null) {
    return {
      amount: null,
      source: 'manual',
      missingData: ['base_price_manual_gbp'],
      note: 'Manual base price is still required for this gate type.',
      styleNote: styleResolution.note,
      styleConfirmed: styleResolution.confirmed,
    }
  }

  return {
    amount: styleResolution.manualGbp,
    source: 'manual',
    missingData: [],
    note: styleResolution.note,
    styleNote: styleResolution.note,
    styleConfirmed: styleResolution.confirmed,
  }
}

export function calculateGateBasePrice(
  config: GateConfig,
  catalog: PricingCatalog = DEFAULT_PRICING_CATALOG,
): BasePricingResult {
  const baseSelection = getBasePriceSource(config, catalog)
  const styleResolution = resolveStyleAwareBasePrice(config, catalog.basePrices[config.gateType])
  const styleCodeSuffix =
    styleResolution.source === 'style_override' ? `:${config.style}` : ''

  return {
    source: baseSelection.source,
    amountGbp: baseSelection.amount,
    missingData: baseSelection.missingData,
    note: baseSelection.note,
    lineItem: {
      code: `${baseSelection.source === 'manual' ? 'base_manual' : 'base_auto'}${styleCodeSuffix}`,
      label: baseSelection.source === 'manual' ? 'Manual base price' : 'Automated base price',
      kind: 'base',
      amountGbp: baseSelection.amount,
      provisional: false,
      note: baseSelection.styleNote,
    },
  }
}

function computeSizeAdjustments(config: GateConfig, catalog: PricingCatalog): PricingLineItem[] {
  const entry = catalog.basePrices[config.gateType]
  const widthStepMm = entry.widthStepMm || SIZE_UPLIFT_WIDTH_STEP_MM
  const heightStepMm = entry.heightStepMm || SIZE_UPLIFT_HEIGHT_STEP_MM
  const widthDeltaMm = Math.max(0, config.widthMm - entry.referenceWidthMm)
  const heightDeltaMm = Math.max(0, config.heightMm - entry.referenceHeightMm)
  const widthSteps = Math.ceil(widthDeltaMm / widthStepMm)
  const heightSteps = Math.ceil(heightDeltaMm / heightStepMm)
  const items: PricingLineItem[] = []

  if (widthSteps > 0) {
    items.push({
      code: 'size_width',
      label: 'Width uplift',
      kind: 'size',
      amountGbp: widthSteps * entry.widthStepGbp,
      provisional: false,
      note: `+£${entry.widthStepGbp} per ${widthStepMm} mm above ${entry.referenceWidthMm} mm (intake).`,
    })
  }

  if (heightSteps > 0) {
    items.push({
      code: 'size_height',
      label: 'Height uplift',
      kind: 'size',
      amountGbp: heightSteps * entry.heightStepGbp,
      provisional: false,
      note: `+£${entry.heightStepGbp} per ${heightStepMm} mm above ${entry.referenceHeightMm} mm (intake).`,
    })
  }

  return items
}

function getEnabledQuantity(quantity: number | undefined): number {
  if (quantity === undefined || quantity <= 0) {
    return 1
  }

  return quantity
}

function computeOptionLineItems(
  config: GateConfig,
  catalog: PricingCatalog,
  variantCatalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): OptionPricingResult {
  const items: PricingLineItem[] = []
  const missingData: string[] = []

  for (const option of config.options) {
    if (!option.enabled) {
      continue
    }

    const pricing = catalog.optionPrices[option.key]
    const quantity = getEnabledQuantity(option.quantity)

    if (option.key === 'aluminium_panels') {
      if (config.style !== 'composite_boards') {
        continue
      }
      const amount = aluminiumUpgradeGbp(config.widthMm)
      items.push({
        code: 'aluminium_panels',
        label: 'Aluminium panel upgrade',
        kind: 'option',
        amountGbp: roundPounds(amount),
        provisional: true,
        note: 'Ship formula: £250 setup + £12.50/panel (width÷139) + £12×4 bars — confirm panel count with workshop.',
      })
      continue
    }

    if (isRailheadOptionKey(option.key)) {
      const variantPricing = resolveRailheadVariantPricing(option, config, variantCatalog)
      if (variantPricing) {
        if (variantPricing.unitGbp === null) {
          items.push({
            code: `${option.key}:${variantPricing.slug}`,
            label: `${formatOptionLabel(option.key)} — ${variantPricing.label}`,
            kind: 'option',
            amountGbp: null,
            provisional: true,
            note: variantPricing.note || 'Variant unit price is still provisional.',
          })
          missingData.push(`option_variant_price:${option.key}:${variantPricing.slug}`)
        } else {
          items.push({
            code: `${option.key}:${variantPricing.slug}`,
            label: `${formatOptionLabel(option.key)} — ${variantPricing.label}`,
            kind: 'option',
            amountGbp: roundPounds(variantPricing.unitGbp * quantity),
            provisional: variantPricing.provisional,
            note: variantPricing.note,
          })
        }
        continue
      }
    }

    if (pricing.kind === 'flat') {
      const flatAmount =
        option.key === 'dog_bars' ? pricing.flatGbp : pricing.flatGbp * quantity
      items.push({
        code: option.key,
        label: formatOptionLabel(option.key),
        kind: 'option',
        amountGbp: roundPounds(flatAmount),
        provisional: pricing.provisional,
        note: pricing.note,
      })
      continue
    }

    if (pricing.kind === 'per_unit') {
      if (pricing.unitGbp === null) {
        items.push({
          code: option.key,
          label: formatOptionLabel(option.key),
          kind: 'option',
          amountGbp: null,
          provisional: true,
          note: 'Unit price is still provisional and must be confirmed.',
        })
        missingData.push(`option_price:${option.key}`)
        continue
      }

      items.push({
        code: option.key,
        label: formatOptionLabel(option.key),
        kind: 'option',
        amountGbp: roundPounds(pricing.unitGbp * quantity),
        provisional: pricing.provisional,
        note: pricing.note,
      })
      continue
    }

    const extraUnits = Math.max(0, quantity - 1)
    items.push({
      code: option.key,
      label: formatOptionLabel(option.key),
      kind: 'option',
      amountGbp: roundPounds(pricing.flatGbp + extraUnits * pricing.unitGbp),
      provisional: pricing.provisional,
      note: pricing.note,
    })
  }

  return { items, missingData }
}

export function calculateGateOptionPricing(
  config: GateConfig,
  catalog: PricingCatalog = DEFAULT_PRICING_CATALOG,
  variantCatalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): OptionPricingResult {
  return computeOptionLineItems(config, catalog, variantCatalog)
}

function sumKnownItems(items: PricingLineItem[]): number {
  return items.reduce((total, item) => total + (item.amountGbp ?? 0), 0)
}

function buildSurveyRequiredResult(
  source: PricingSource,
  basePriceGbp: number | null,
  breakdown: PricingLineItem[],
  missingData: string[],
  assumptions: string[],
  issues: PricingIssue[],
  siteSurveyRequested = false,
): PricingResult {
  const subtotalKnownGbp = sumKnownItems(breakdown)

  return {
    currency: 'GBP',
    status: 'survey_required',
    source,
    basePriceGbp,
    subtotalKnownGbp,
    totalGbp: null,
    totalLabel: 'Price on request',
    disclaimer: DEFAULT_DISCLAIMER,
    breakdown,
    missingData,
    assumptions,
    issues,
    siteSurveyRequested,
  }
}

export function calculateIndicativeGatePrice(
  config: GateConfig,
  catalog: PricingCatalog = DEFAULT_PRICING_CATALOG,
  variantCatalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): PricingResult {
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    return buildSurveyRequiredResult(
      config.motorised ? 'auto' : 'manual',
      null,
      [],
      validation.issues.map((issue) => `${issue.field}:${issue.code}`),
      ['Configuration failed domain validation before pricing.'],
      validation.issues,
      config.siteSurveyRequested === true,
    )
  }

  const baseSelection = calculateGateBasePrice(config, catalog)
  const styleResolution = resolveStyleAwareBasePrice(config, catalog.basePrices[config.gateType])
  const assumptions: string[] = []
  const missingData: string[] = [...baseSelection.missingData]

  const styleAssumption = stylePricingAssumption(styleResolution)
  if (styleAssumption) {
    assumptions.push(styleAssumption)
  }

  if (config.siteSurveyRequested) {
    assumptions.push(SITE_SURVEY_ASSUMPTION)
  }

  if (config.fulfilment === 'supply_only') {
    assumptions.push(SUPPLY_ONLY_ASSUMPTION)
  }

  const breakdown: PricingLineItem[] = [baseSelection.lineItem]

  if (config.widthMm > catalog.basePrices[config.gateType].referenceWidthMm) {
    const entry = catalog.basePrices[config.gateType]
    assumptions.push(
      `Width uplift: +£${entry.widthStepGbp} per ${entry.widthStepMm} mm above ${entry.referenceWidthMm} mm.`,
    )
  }

  if (config.heightMm > catalog.basePrices[config.gateType].referenceHeightMm) {
    const entry = catalog.basePrices[config.gateType]
    assumptions.push(
      `Height uplift: +£${entry.heightStepGbp} per ${entry.heightStepMm} mm above ${entry.referenceHeightMm} mm.`,
    )
  }

  const sizeAdjustments = computeSizeAdjustments(config, catalog)
  breakdown.push(...sizeAdjustments)

  const optionResult = calculateGateOptionPricing(config, catalog, variantCatalog)
  breakdown.push(...optionResult.items)
  missingData.push(...optionResult.missingData)

  if (baseSelection.amountGbp === null || missingData.length > 0) {
    assumptions.push('Missing confirmed pricing data prevents a final total.')
    return buildSurveyRequiredResult(
      baseSelection.source,
      null,
      breakdown,
      missingData,
      assumptions,
      [],
      config.siteSurveyRequested,
    )
  }

  const subtotalKnownGbp = sumKnownItems(breakdown)

  return {
    currency: 'GBP',
    status: 'indicative',
    source: baseSelection.source,
    basePriceGbp: baseSelection.amountGbp,
    subtotalKnownGbp,
    totalGbp: subtotalKnownGbp,
    totalLabel: `${formatMoney(subtotalKnownGbp)} indicative`,
    disclaimer: DEFAULT_DISCLAIMER,
    breakdown,
    missingData,
    assumptions,
    issues: [],
    siteSurveyRequested: config.siteSurveyRequested,
  }
}

export function calculateIndicativeGatePriceFromDraft(
  input: Partial<GateConfig> & { gateType?: unknown } = {},
  catalog: PricingCatalog = DEFAULT_PRICING_CATALOG,
  variantCatalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): PricingResult {
  const draftValidation = validateGateConfigDraftInput(input)
  if (!draftValidation.ok) {
    return buildSurveyRequiredResult(
      typeof input === 'object' && input !== null && 'motorised' in input && input.motorised === true ? 'auto' : 'manual',
      null,
      [],
      draftValidation.issues.map((issue) => `${issue.field}:${issue.code}`),
      ['Configuration draft failed structural validation before pricing.'],
      draftValidation.issues,
      input.siteSurveyRequested === true,
    )
  }

  const normalized = normalizeGateConfig(input)

  return calculateIndicativeGatePrice(normalized, catalog, variantCatalog)
}
