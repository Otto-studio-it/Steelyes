import type { GateConfig, PricingResult } from '@steelyes/gate-engine'

import {
  finishLabel,
  formatPricingHeadline,
  gateTypeLabel,
  postsSummaryLabel,
  SITE_SURVEY_FIELD_LABEL,
  siteSurveyLabel,
  styleLabel,
} from '@/lib/configurator/labels'

export type ConfigurationSummaryLine = {
  label: string
  value: string
}

export function buildConfigurationSummaryLines(
  config: GateConfig,
  pricing?: PricingResult,
): ConfigurationSummaryLine[] {
  const lines: ConfigurationSummaryLine[] = [
    { label: 'Gate type', value: gateTypeLabel(config.gateType) },
    { label: 'Style', value: styleLabel(config.style) },
    { label: 'Dimensions', value: `${config.widthMm} × ${config.heightMm} mm` },
    { label: 'Finish', value: finishLabel(config.finish) },
    { label: 'Motorised', value: config.motorised ? 'Yes' : 'No' },
    { label: 'Mounting posts', value: postsSummaryLabel(config) },
    { label: SITE_SURVEY_FIELD_LABEL, value: siteSurveyLabel(config.siteSurveyRequested) },
  ]

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
  return [
    gateTypeLabel(config.gateType),
    styleLabel(config.style),
    `${config.widthMm} × ${config.heightMm} mm`,
    finishLabel(config.finish),
    config.motorised ? 'Motorised' : 'Manual',
    postsSummaryLabel(config),
    `${SITE_SURVEY_FIELD_LABEL}: ${siteSurveyLabel(config.siteSurveyRequested)}`,
  ].join(' · ')
}
