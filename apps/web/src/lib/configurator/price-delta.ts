import {
  calculateIndicativeGatePrice,
  type GateConfig,
  type GateOptionKey,
  type PricingCatalog,
} from '@steelyes/gate-engine'

import { updateOption } from '@/lib/configurator/option-actions'

export type OptionEnableDelta = {
  /** Cost of enabling the option at current quantity (on total − off total). Null = survey/unknown. */
  deltaGbp: number | null
  provisional: boolean
}

/** Estimate how much enabling this option adds to the indicative total. */
export function estimateOptionEnableDelta(
  config: GateConfig,
  catalog: PricingCatalog,
  key: GateOptionKey,
): OptionEnableDelta {
  const existing = config.options.find((item) => item.key === key)
  const quantity = Math.max(1, existing?.quantity ?? 1)
  const offConfig = updateOption(config, key, false, 0)
  const onConfig = updateOption(config, key, true, quantity)
  const offPrice = calculateIndicativeGatePrice(offConfig, catalog)
  const onPrice = calculateIndicativeGatePrice(onConfig, catalog)

  if (offPrice.totalGbp === null || onPrice.totalGbp === null) {
    return { deltaGbp: null, provisional: true }
  }

  return {
    deltaGbp: onPrice.totalGbp - offPrice.totalGbp,
    provisional: offPrice.status === 'survey_required' || onPrice.status === 'survey_required',
  }
}

/** Format a signed money delta for chips (+£1,200 / −£50 / Survey). */
export function formatPriceDelta(deltaGbp: number | null): string | null {
  if (deltaGbp === null) return 'Survey'
  if (deltaGbp === 0) return null
  const abs = Math.abs(deltaGbp).toLocaleString('en-GB')
  return deltaGbp > 0 ? `+£${abs}` : `−£${abs}`
}
