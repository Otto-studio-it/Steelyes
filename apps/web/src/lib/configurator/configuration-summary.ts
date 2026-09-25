import {
  findRailheadVariant,
  railheadSeriesLabel,
  railheadWorkshopLabel,
  type GateConfig,
  type GateOptionKey,
  type PricingResult,
} from '@steelyes/gate-engine'

import {
  finishLabel,
  formatLabelText,
  formatPricingHeadline,
  formatPricingValueLabel,
  gateTypeLabel,
  postsSummaryLabel,
  FULFILMENT_FIELD_LABEL,
  fulfilmentLabel,
  SITE_SURVEY_FIELD_LABEL,
  siteSurveyLabel,
  styleLabel,
} from '@/lib/configurator/labels'

export type ConfigurationSummaryLine = {
  label: string
  value: string
}

export type ConfigurationSummaryAudience = 'customer' | 'workshop'

const OPTION_DISPLAY_LABELS: Record<GateOptionKey, string> = {
  middle_bar: 'Middle bar',
  top_railheads: 'Top railheads',
  dog_bars: 'Dog bars',
  dog_bar_railheads: 'Dog bar railheads',
  arched_top: 'Arched top',
  circles: 'Circles',
  picket_collars: 'Picket collars',
  bushes: 'Bushes',
  spirals: 'Spirals',
  aluminium_panels: 'Aluminium panel upgrade',
}

function railheadsSummaryValue(
  config: GateConfig,
  audience: ConfigurationSummaryAudience = 'customer',
): string | null {
  const option = config.options.find((item) => item.key === 'top_railheads')
  if (!option?.enabled) {
    return null
  }

  if (!option.variant) {
    return audience === 'workshop' ? 'selected (SKU TBC)' : 'selected (series TBC)'
  }

  const entry = findRailheadVariant(option.variant)
  const slug = entry?.slug ?? option.variant
  return audience === 'workshop' ? railheadWorkshopLabel(slug) : railheadSeriesLabel(slug)
}

function formatOptionValue(
  key: GateOptionKey,
  config: GateConfig,
  pricing: PricingResult | undefined,
  audience: ConfigurationSummaryAudience,
): string {
  if (key === 'top_railheads') {
    const railheadsValue = railheadsSummaryValue(config, audience)
    if (!railheadsValue) return 'Selected'
    return railheadsValue
  }

  const pricingItem = pricing?.breakdown.find((item) =>
    item.code === key || item.code.startsWith(`${key}:`)
  )

  if (pricingItem?.amountGbp && pricingItem.amountGbp > 0) {
    return `Selected · ${formatPricingValueLabel(pricingItem)}`
  }

  return 'Selected'
}

export function buildConfigurationSummaryLines(
  config: GateConfig,
  pricing?: PricingResult,
  audience: ConfigurationSummaryAudience = 'customer',
): ConfigurationSummaryLine[] {
  const lines: ConfigurationSummaryLine[] = [
    { label: 'Gate type', value: gateTypeLabel(config.gateType) },
    { label: 'Style', value: styleLabel(config.style) },
    { label: 'Dimensions', value: `${config.widthMm} × ${config.heightMm} mm` },
    { label: 'Finish', value: finishLabel(config.finish, config.customFinishHex) },
    { label: 'Motorised', value: config.motorised ? 'Yes' : 'No' },
    { label: 'Mounting posts', value: postsSummaryLabel(config) },
  ]

  for (const option of config.options) {
    if (option.enabled) {
      const label = OPTION_DISPLAY_LABELS[option.key] || formatLabelText(option.key)
      const value = formatOptionValue(option.key, config, pricing, audience)
      lines.push({ label, value })
    }
  }

  const postCapItem = pricing?.breakdown.find((item) => item.code === 'post_cap')
  if (postCapItem) {
    const capValue = postCapItem.amountGbp && postCapItem.amountGbp > 0
      ? `${formatPricingValueLabel(postCapItem)}`
      : 'Included'
    lines.push({ label: 'Post cap', value: capValue })
  }

  if (config.fencePanels.quantity > 0) {
    lines.push({
      label: 'Railing panels',
      value: `${config.fencePanels.quantity} panel${config.fencePanels.quantity > 1 ? 's' : ''} (quoted separately)`,
    })
    config.fencePanels.panels.forEach((panel, index) => {
      lines.push({
        label: `Panel ${index + 1}`,
        value: `${panel.lengthMm} mm × ${panel.heightMm} mm`,
      })
    })
  }

  lines.push({
    label: FULFILMENT_FIELD_LABEL,
    value: fulfilmentLabel(config.fulfilment),
  })

  lines.push({
    label: SITE_SURVEY_FIELD_LABEL,
    value: siteSurveyLabel(config.siteSurveyRequested),
  })

  if (pricing) {
    lines.push({
      label: 'Estimate',
      value: `${formatPricingHeadline(pricing)} · ${pricing.totalLabel}`,
    })
  }

  return lines
}

export function formatConfigurationSummaryText(
  config: GateConfig,
  pricing?: PricingResult,
  audience: ConfigurationSummaryAudience = 'customer',
): string {
  return buildConfigurationSummaryLines(config, pricing, audience)
    .map((line) => `${line.label}: ${line.value}`)
    .join(' · ')
}

export function formatConfigurationSummaryInline(config: GateConfig, pricing?: PricingResult): string {
  const lines = buildConfigurationSummaryLines(config, pricing, 'customer')
  return lines.map((line) => `${line.label}: ${line.value}`).join(' · ')
}
