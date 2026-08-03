'use client'

import { Sparkles } from 'lucide-react'
import type { GateConfig, PricingCatalog } from '@steelyes/gate-engine'

import { PricingDisclaimer } from '@/components/marketing/PricingDisclaimer'
import { buildConfigurationSummaryLines } from '@/lib/configurator/configuration-summary'
import {
  formatLabelText,
  formatPricingDisplayAmount,
  formatPricingDisplayHeadline,
  formatPricingDisplayNote,
  formatPricingMissingDataLabel,
  formatPricingStatusLabel,
  formatPricingValueLabel,
  type PricingCopyVariant,
} from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorPricing } from '@/store/configuratorStore'

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-steel/8 py-3 last:border-b-0">
      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className="text-right font-heading text-sm font-bold uppercase tracking-tight text-steel">{value}</dd>
    </div>
  )
}

type ConfiguratorPriceSummaryProps = {
  config?: GateConfig
  compact?: boolean
  pricingCopyVariant?: PricingCopyVariant
  pricingCatalog?: PricingCatalog
}

export function ConfiguratorPriceSummary({
  config: configOverride,
  compact = false,
  pricingCopyVariant = 'desktop',
  pricingCatalog,
}: ConfiguratorPriceSummaryProps) {
  const storeConfig = useConfiguratorConfig()
  const config = configOverride ?? storeConfig
  const pricing = useConfiguratorPricing(config, pricingCatalog)
  const missingDataSummary = pricing.missingData.slice(0, 3).map(formatPricingMissingDataLabel)
  const isMobileCopy = pricingCopyVariant === 'mobile'

  return (
    <div className="overflow-hidden border border-steel/10 bg-white">
      <div className="border-b border-steel/8 px-4 py-4 lg:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Price summary</p>
        <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight text-steel">
          {formatPricingDisplayHeadline(pricing, pricingCopyVariant)}
        </h2>
      </div>

      <div className="px-4 py-4 lg:px-5 lg:py-5">
        <div className="border border-steel/10 bg-steel px-4 py-4 text-white lg:px-5 lg:py-5">
          {!isMobileCopy ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">Live estimate</p>
          ) : null}
          <p
            className={`font-heading font-black uppercase tracking-tight ${compact ? 'text-2xl' : 'text-4xl'} ${
              isMobileCopy ? '' : 'mt-2'
            }`}
          >
            {formatPricingDisplayAmount(pricing, pricingCopyVariant)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            {formatPricingDisplayNote(pricing, pricingCopyVariant)}
          </p>
          <PricingDisclaimer
            compact
            className="mt-3 border-white/20 bg-white/5 text-white/75"
          />
          {pricing.missingData.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">Still missing</p>
              <p className="mt-1 text-sm leading-6 text-white/75">
                {missingDataSummary.join(', ')}
              </p>
            </div>
          ) : null}
        </div>

        {!compact ? (
          <>
            <dl className="mt-5">
              {buildConfigurationSummaryLines(config).map((line) => (
                <SummaryRow key={line.label} label={line.label} value={line.value} />
              ))}
              <SummaryRow label="Pricing source" value={pricing.source === 'auto' ? 'Auto base' : 'Manual base'} />
            </dl>

            <div className="mt-5 rounded-[22px] border border-primary/16 bg-primary/4 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary">Breakdown</p>
              <div className="mt-3 space-y-3">
                {pricing.breakdown.map((item) => {
                  const statusLabel = formatPricingStatusLabel(item, pricing)

                  return (
                    <div key={item.code} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                          {formatLabelText(item.label)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-deep">{item.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold uppercase tracking-tight text-steel">
                          {formatPricingValueLabel(item)}
                        </p>
                        {statusLabel ? (
                          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                            {statusLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-dashed border-steel/14 bg-paper px-4 py-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Visibility and follow-up
              </p>
              {pricing.assumptions.length > 0 ? (
                <div className="mt-3 rounded-xl border border-steel/8 bg-white px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Style pricing notes</p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted-deep">
                    {pricing.assumptions.map((assumption) => (
                      <li key={assumption}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-deep">
                <li>
                  <strong className="font-semibold text-steel">Preview:</strong> the 2D sketch updates immediately.
                </li>
                <li>
                  <strong className="font-semibold text-steel">Price:</strong> confirmed pricing shown; final total is
                  set once decorative option counts are confirmed at survey.
                </li>
                <li>
                  <strong className="font-semibold text-steel">Next step:</strong> use the survey-led quote flow
                  when you are ready to proceed.
                </li>
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
