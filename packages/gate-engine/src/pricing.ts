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
  normalizeGateConfig,
  validateGateConfig,
  validateGateConfigDraftInput,
} from './validation'
import {
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from './types'
import type { ValidationIssue } from './validation'

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
  widthStepGbp: number
  heightStepGbp: number
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

const DEFAULT_DISCLAIMER = 'Indicative, subject to survey'

export const DEFAULT_PRICING_CATALOG: PricingCatalog = {
  basePrices: {
    double_swing: {
      manualGbp: 1800,
      autoGbp: 3800,
      referenceWidthMm: 1800,
      referenceHeightMm: 1000,
      widthStepGbp: 90,
      heightStepGbp: 80,
    },
    single_swing: {
      manualGbp: 850,
      autoGbp: 2700,
      referenceWidthMm: 850,
      referenceHeightMm: 1000,
      widthStepGbp: 70,
      heightStepGbp: 60,
    },
    tracked_sliding: {
      manualGbp: 2200,
      autoGbp: 3600,
      referenceWidthMm: 2550,
      referenceHeightMm: 1000,
      widthStepGbp: 75,
      heightStepGbp: 70,
    },
    cantilever_sliding: {
      manualGbp: 2900,
      autoGbp: 4200,
      referenceWidthMm: 2550,
      referenceHeightMm: 1000,
      widthStepGbp: 85,
      heightStepGbp: 70,
    },
    bifolding_double_swing: {
      manualGbp: 2500,
      autoGbp: 4200,
      referenceWidthMm: 2950,
      referenceHeightMm: 1000,
      widthStepGbp: 95,
      heightStepGbp: 80,
    },
    single_bifolding: {
      manualGbp: 1900,
      autoGbp: 3000,
      referenceWidthMm: 1550,
      referenceHeightMm: 1000,
      widthStepGbp: 85,
      heightStepGbp: 75,
    },
    telescopic_sliding: {
      manualGbp: 3100,
      autoGbp: 4200,
      referenceWidthMm: 2050,
      referenceHeightMm: 1000,
      widthStepGbp: 90,
      heightStepGbp: 70,
    },
    radius_sliding: {
      manualGbp: 2500,
      autoGbp: 4200,
      referenceWidthMm: 1650,
      referenceHeightMm: 1000,
      widthStepGbp: 90,
      heightStepGbp: 70,
    },
  },
  optionPrices: {
    middle_bar: {
      kind: 'flat',
      flatGbp: 275,
      provisional: true,
      note: 'Client reference price for middle bar.',
    },
    top_railheads: {
      kind: 'per_unit',
      unitGbp: null,
      provisional: true,
      note: 'Railhead variant pricing is still provisional.',
    },
    dog_bars: {
      kind: 'flat_plus_units',
      flatGbp: 75,
      unitGbp: 4.5,
      provisional: true,
      note: 'Client reference price for dog bars.',
    },
    dog_bar_railheads: {
      kind: 'per_unit',
      unitGbp: null,
      provisional: true,
      note: 'Railhead variant pricing is still provisional.',
    },
    arched_top: {
      kind: 'flat',
      flatGbp: 850,
      provisional: true,
      note: 'Client reference price for arched top.',
    },
    bushes: {
      kind: 'per_unit',
      unitGbp: 2.5,
      provisional: true,
      note: 'Client reference minimum price for bushes.',
    },
    spirals: {
      kind: 'per_unit',
      unitGbp: 3.8,
      provisional: true,
      note: 'Client reference minimum price for spirals.',
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
      provisional: true,
      note: baseSelection.styleNote,
    },
  }
}

function computeSizeAdjustments(config: GateConfig, catalog: PricingCatalog): PricingLineItem[] {
  const entry = catalog.basePrices[config.gateType]
  const widthDeltaMm = Math.max(0, config.widthMm - entry.referenceWidthMm)
  const heightDeltaMm = Math.max(0, config.heightMm - entry.referenceHeightMm)
  const widthSteps = Math.ceil(widthDeltaMm / 100)
  const heightSteps = Math.ceil(heightDeltaMm / 100)
  const items: PricingLineItem[] = []

  if (widthSteps > 0) {
    items.push({
      code: 'size_width',
      label: 'Width uplift',
      kind: 'size',
      amountGbp: widthSteps * entry.widthStepGbp,
      provisional: true,
      note: `Indicative width uplift at 100mm bands from ${entry.referenceWidthMm}mm.`,
    })
  }

  if (heightSteps > 0) {
    items.push({
      code: 'size_height',
      label: 'Height uplift',
      kind: 'size',
      amountGbp: heightSteps * entry.heightStepGbp,
      provisional: true,
      note: `Indicative height uplift at 100mm bands from ${entry.referenceHeightMm}mm.`,
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
      items.push({
        code: option.key,
        label: formatOptionLabel(option.key),
        kind: 'option',
        amountGbp: roundPounds(pricing.flatGbp * quantity),
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

  const breakdown: PricingLineItem[] = [baseSelection.lineItem]

  if (config.widthMm > catalog.basePrices[config.gateType].referenceWidthMm) {
    assumptions.push('Width uplift is banded at 100mm steps above the reference size.')
  }

  if (config.heightMm > catalog.basePrices[config.gateType].referenceHeightMm) {
    assumptions.push('Height uplift is banded at 100mm steps above the reference size.')
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
    )
  }

  const normalized = normalizeGateConfig(input)

  return calculateIndicativeGatePrice(normalized, catalog, variantCatalog)
}
