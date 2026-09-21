import { findRailheadVariant, type GateConfig, type PricingResult } from '@steelyes/gate-engine'

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

function railheadsSummaryValue(config: GateConfig): string | null {
  const option = config.options.find((item) => item.key === 'top_railheads')
  if (!option?.enabled) {
    return null
  }

  if (!option.variant) {
    return 'selected (SKU TBC)'
  }

  const entry = findRailheadVariant(option.variant)
  return entry?.slug ?? option.variant
}

export function buildConfigurationSummaryLines(
  config: GateConfig,
  pricing?: PricingResult,
): ConfigurationSummaryLine[] {
  const lines: ConfigurationSummaryLine[] = [
    { label: 'Gate type', value: gateTypeLabel(config.gateType) },
    { label: 'Style', value: styleLabel(config.style) },
    { label: 'Dimensions', value: `${config.widthMm} × ${config.heightMm} mm` },
    { label: 'Finish', value: finishLabel(config.finish, config.customFinishHex) },
    { label: 'Motorised', value: config.motorised ? 'Yes' : 'No' },
    { label: 'Mounting posts', value: postsSummaryLabel(config) },
  ]

  const railheads = railheadsSummaryValue(config)
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
): string {
  return buildConfigurationSummaryLines(config, pricing)
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

  const railheads = railheadsSummaryValue(config)
  if (railheads) {
    parts.push(`Railheads: ${railheads}`)
  }

  parts.push(`${FULFILMENT_FIELD_LABEL}: ${fulfilmentLabel(config.fulfilment)}`)
  parts.push(`${SITE_SURVEY_FIELD_LABEL}: ${siteSurveyLabel(config.siteSurveyRequested)}`)
  return parts.join(' · ')
}
