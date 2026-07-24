import type { GateConfig, PricingResult } from '@steelyes/gate-engine'

import { buildConfigurationSummaryLines } from '@/lib/configurator/configuration-summary'

type ConfigurationSummaryProps = {
  config: GateConfig
  pricing?: PricingResult
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export function ConfigurationSummary({
  config,
  pricing,
  className = 'mt-3 space-y-2 text-sm text-steel',
  labelClassName = 'text-muted',
  valueClassName = 'font-heading font-bold uppercase',
}: ConfigurationSummaryProps) {
  const lines = buildConfigurationSummaryLines(config, pricing)

  return (
    <dl className={className}>
      {lines.map((line) => (
        <div key={line.label} className="flex justify-between gap-4">
          <dt className={labelClassName}>{line.label}</dt>
          <dd className={`text-right ${valueClassName}`}>{line.value}</dd>
        </div>
      ))}
    </dl>
  )
}
