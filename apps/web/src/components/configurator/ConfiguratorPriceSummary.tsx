'use client'

import { Sparkles } from 'lucide-react'
import type { GateConfig } from '@steelyes/gate-engine'

import { ConfiguratorQuoteHandoffButton } from '@/components/configurator/ConfiguratorQuoteHandoffButton'

import {
  formatLabelText,
  finishLabel,
  formatPricingHeadline,
  formatPricingLead,
  formatPricingMissingDataLabel,
  formatPricingStatusLabel,
  formatPricingValueLabel,
  gateTypeLabel,
  styleLabel,
} from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorPricing } from '@/store/configuratorStore'

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#1B1C1A]/8 py-3 last:border-b-0">
      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D615D]">{label}</dt>
      <dd className="text-right font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">{value}</dd>
    </div>
  )
}

type ConfiguratorPriceSummaryProps = {
  config?: GateConfig
  showActions?: boolean
  compact?: boolean
}

export function ConfiguratorPriceSummary({
  config: configOverride,
  showActions = true,
  compact = false,
}: ConfiguratorPriceSummaryProps) {
  const storeConfig = useConfiguratorConfig()
  const config = configOverride ?? storeConfig
  const pricing = useConfiguratorPricing(config)
  const missingDataSummary = pricing.missingData.slice(0, 3).map(formatPricingMissingDataLabel)

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1B1C1A]/10 bg-white/92 shadow-[0_18px_50px_rgba(25,20,18,0.1)] backdrop-blur-sm lg:rounded-[28px]">
      <div className="border-b border-[#1B1C1A]/8 px-4 py-4 lg:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9E000C]">Price summary</p>
        <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight text-[#1B1C1A]">
          {formatPricingHeadline(pricing)}
        </h2>
      </div>

      <div className="px-4 py-4 lg:px-5 lg:py-5">
        <div className="rounded-[22px] border border-[#1B1C1A]/10 bg-[#1B1C1A] px-4 py-4 text-white lg:px-5 lg:py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">Live estimate</p>
          <p className={`mt-2 font-heading font-black uppercase tracking-tight ${compact ? 'text-2xl' : 'text-4xl'}`}>
            {pricing.totalLabel}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            {pricing.disclaimer}. {formatPricingLead(pricing)}
          </p>
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
              <SummaryRow label="Gate type" value={gateTypeLabel(config.gateType)} />
              <SummaryRow label="Style" value={styleLabel(config.style)} />
              <SummaryRow label="Dimensions" value={`${config.widthMm} × ${config.heightMm} mm`} />
              <SummaryRow label="Finish" value={finishLabel(config.finish)} />
              <SummaryRow label="Motorised" value={config.motorised ? 'Yes' : 'No'} />
              <SummaryRow label="Pricing source" value={pricing.source === 'auto' ? 'Auto base' : 'Manual base'} />
            </dl>

            <div className="mt-5 rounded-[22px] border border-[#9E000C]/16 bg-[#9E000C]/4 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#9E000C]">Breakdown</p>
              <div className="mt-3 space-y-3">
                {pricing.breakdown.map((item) => {
                  const statusLabel = formatPricingStatusLabel(item, pricing)

                  return (
                    <div key={item.code} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">
                          {formatLabelText(item.label)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#5B514D]">{item.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">
                          {formatPricingValueLabel(item)}
                        </p>
                        {statusLabel ? (
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E000C]">
                            {statusLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-dashed border-[#1B1C1A]/14 bg-[#F9F7F4] px-4 py-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#6D615D]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Visibility and follow-up
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B514D]">
                <li>
                  <strong className="font-semibold text-[#1B1C1A]">Preview:</strong> the 2D sketch updates immediately.
                </li>
                <li>
                  <strong className="font-semibold text-[#1B1C1A]">Price:</strong> indicative only until survey and final
                  pricing are confirmed.
                </li>
                <li>
                  <strong className="font-semibold text-[#1B1C1A]">Next step:</strong> use the survey-led quote flow
                  when you are ready to proceed.
                </li>
              </ul>
            </div>
          </>
        ) : null}

        {showActions ? (
          <div className="mt-5 hidden flex-col gap-3 sm:flex-row lg:flex">
            <ConfiguratorQuoteHandoffButton className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#9E000C] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#8A0009] disabled:opacity-60" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
