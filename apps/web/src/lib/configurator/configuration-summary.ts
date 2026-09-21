import {
  findRailheadVariant,
  railheadSeriesLabel,
  railheadWorkshopLabel,
  type GateConfig,
  type PricingResult,
} from '@steelyes/gate-engine'

import {
  finishLabel,
  formatPricingHeadline,
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

  const railheads = railheadsSummaryValue(config, audience)
  if (railheads) {
    lines.push({ label: 'Railheads', value: railheads })
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

export function formatConfigurationSummaryInline(config: GateConfig): string {
  const parts = [
    gateTypeLabel(config.gateType),
    styleLabel(config.style),
    `${config.widthMm} × ${config.heightMm} mm`,
    finishLabel(config.finish, config.customFinishHex),
    config.motorised ? 'Motorised' : 'Manual',
    postsSummaryLabel(config),
  ]

  const railheads = railheadsSummaryValue(config, 'customer')
  if (railheads) {
    parts.push(`Railheads: ${railheads}`)
  }

  parts.push(`${FULFILMENT_FIELD_LABEL}: ${fulfilmentLabel(config.fulfilment)}`)
  parts.push(`${SITE_SURVEY_FIELD_LABEL}: ${siteSurveyLabel(config.siteSurveyRequested)}`)
  return parts.join(' · ')
}
