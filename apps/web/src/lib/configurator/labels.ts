import {
  getFinishDefinition,
  POST_CAP_LABELS,
  POST_MATERIAL_LABELS,
  type FinishCode,
  type FulfilmentMode,
  type GateConfig,
  type GateStyle,
  type GateType,
  type PricingLineItem,
  type PricingResult,
} from '@steelyes/gate-engine'

const STYLE_LABELS: Record<GateStyle, string> = {
  traditional_victorian: 'Traditional Victorian Style',
  composite_boards: 'Composite Boards',
}

export function gateTypeLabel(gateType: GateType): string {
  return titleCaseWords(gateType.split('_').join(' '))
}

export function styleLabel(style: GateStyle): string {
  return STYLE_LABELS[style]
}

export const SITE_SURVEY_FIELD_LABEL = 'Site survey requested'

export function siteSurveyLabel(requested: boolean): string {
  return requested ? 'Requested' : 'Not requested'
}

export const FULFILMENT_FIELD_LABEL = 'Supply or install'

export const FULFILMENT_OPTION_COPY: Record<
  FulfilmentMode,
  { label: string; description: string }
> = {
  supply_and_install: {
    label: 'Supply and install',
    description:
      'Steelyes fabricates and fits on site. Installation cost is confirmed after survey — not added as a figure here.',
  },
  supply_only: {
    label: 'Supply only',
    description:
      'Gate delivered ready to fit. You arrange installation. The estimate is fabrication only.',
  },
}

export function fulfilmentLabel(mode: FulfilmentMode): string {
  return FULFILMENT_OPTION_COPY[mode].label
}

export function postsSummaryLabel(config: GateConfig): string {
  if (!config.posts.enabled || config.posts.material === 'none') {
    return 'No mounting posts'
  }
  return `${POST_MATERIAL_LABELS[config.posts.material]} · ${POST_CAP_LABELS[config.posts.capStyle]}`
}

export function finishLabel(finish: FinishCode, customFinishHex?: string | null): string {
  if (finish === 'other_ral' && customFinishHex) {
    const hex = customFinishHex.startsWith('#') ? customFinishHex.toUpperCase() : `#${customFinishHex.toUpperCase()}`
    return `Custom ${hex}`
  }
  return getFinishDefinition(finish).label
}

export function formatLabelText(key: string): string {
  return titleCaseWords(key.split('_').join(' '))
}

/** Title-case words for product labels (Double Swing, not double swing). */
function titleCaseWords(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/** Soften engine validation copy for the configurator UI. */
export function humanizeValidationMessage(message: string): string {
  return message
    .replace(
      /^Width must be between (\d+)mm and (\d+)mm\.$/,
      'Choose a width between $1 and $2 mm.',
    )
    .replace(
      /^Height must be between (\d+)mm and (\d+)mm\.$/,
      'Choose a height between $1 and $2 mm.',
    )
    .replace(/(\d+)mm/g, '$1 mm')
}

export function formatPricingHeadline(pricing: PricingResult): string {
  return pricing.status === 'survey_required' ? 'Price on request' : 'Estimated total'
}

export function formatPricingBarHeadline(pricing: PricingResult): string {
  return pricing.status === 'survey_required' ? 'Survey required' : 'Live estimate'
}

export function formatPricingBarAmount(pricing: PricingResult): string {
  if (pricing.status === 'survey_required') {
    return 'Price on request'
  }

  if (pricing.totalGbp === null) {
    return pricing.totalLabel
  }

  return `£${pricing.totalGbp.toLocaleString('en-GB')}`
}

export type PricingCopyVariant = 'desktop' | 'mobile'

export function formatPricingDisplayHeadline(
  pricing: PricingResult,
  variant: PricingCopyVariant = 'desktop',
): string {
  return variant === 'mobile' ? formatPricingBarHeadline(pricing) : formatPricingHeadline(pricing)
}

export function formatPricingDisplayAmount(
  pricing: PricingResult,
  variant: PricingCopyVariant = 'desktop',
): string {
  return variant === 'mobile' ? formatPricingBarAmount(pricing) : pricing.totalLabel
}

export function formatPricingDisplayNote(
  pricing: PricingResult,
  variant: PricingCopyVariant = 'desktop',
): string {
  if (variant === 'mobile') {
    return pricing.disclaimer
  }

  return `${pricing.disclaimer}. ${formatPricingLead(pricing)}`
}

export function formatPricingLead(pricing: PricingResult): string {
  if (pricing.status === 'survey_required') {
    return 'Some pricing inputs are still provisional. The current summary is held as a survey-led estimate.'
  }

  if (pricing.assumptions.some((assumption) => assumption.toLowerCase().includes('composite boards'))) {
    return 'Base price reflects the selected gate style. Pricing is confirmed; decorative option counts are finalised at site survey.'
  }

  return 'Base price, size bands, and confirmed add-ons are shown below. Pricing is confirmed; decorative option counts are finalised at site survey.'
}

export function formatPricingValueLabel(item: PricingLineItem): string {
  if (item.amountGbp === null) {
    return 'Survey required'
  }

  return `£${item.amountGbp.toLocaleString('en-GB')}`
}

export function formatPricingStatusLabel(item: PricingLineItem, pricing: PricingResult): string | null {
  if (item.amountGbp === null) {
    return 'Survey required'
  }

  if (pricing.status === 'survey_required') {
    return 'Provisional'
  }

  return item.provisional ? 'Indicative' : null
}

export function formatPricingMissingDataLabel(code: string): string {
  if (code === 'base_price_manual_gbp') {
    return 'manual base price'
  }

  if (code === 'base_price_auto_gbp') {
    return 'motorised base price'
  }

  if (code.startsWith('option_price:')) {
    const optionKey = code.split(':')[1] ?? 'option'
    return `${optionKey.split('_').join(' ')} price`
  }

  return code.split('_').join(' ')
}
