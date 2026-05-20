import { getFinishDefinition, type FinishCode, type GateStyle, type GateType, type PricingLineItem, type PricingResult } from '@steelyes/gate-engine'

export function gateTypeLabel(gateType: GateType): string {
  return gateType.split('_').join(' ')
}

export function styleLabel(style: GateStyle): string {
  return style.split('_').join(' ')
}

export function finishLabel(finish: FinishCode): string {
  return getFinishDefinition(finish).label
}

export function formatLabelText(key: string): string {
  return key.split('_').join(' ')
}

export function formatPricingHeadline(pricing: PricingResult): string {
  return pricing.status === 'survey_required' ? 'Price on request' : 'Indicative total'
}

export function formatPricingLead(pricing: PricingResult): string {
  if (pricing.status === 'survey_required') {
    return 'Some pricing inputs are still provisional. The current summary is held as a survey-led estimate.'
  }

  return 'Base price, size bands, and confirmed add-ons are shown below. The total remains indicative.'
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
