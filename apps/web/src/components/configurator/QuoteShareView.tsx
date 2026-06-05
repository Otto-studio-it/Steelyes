'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  calculateIndicativeGatePrice,
  type GateConfig,
} from '@steelyes/gate-engine'

import { ConfiguratorPreviewPanel } from '@/components/configurator/ConfiguratorPreviewPanel'
import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { buildContactHandoffPath } from '@/lib/configurator/share-token'
import {
  finishLabel,
  formatPricingDisplayAmount,
  formatPricingDisplayHeadline,
  gateTypeLabel,
  styleLabel,
  type PricingCopyVariant,
} from '@/lib/configurator/labels'

type QuoteShareViewProps = {
  config: GateConfig
  shareToken: string
}

export function QuoteShareView({ config, shareToken }: QuoteShareViewProps) {
  const pricing = calculateIndicativeGatePrice(config)
  const viewport = useConfiguratorViewport()
  const pricingCopyVariant: PricingCopyVariant = viewport.mode === 'desktop' ? 'desktop' : 'mobile'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]">
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9E000C]">Shared configuration</p>
        <h1 className="mt-2 font-heading text-[clamp(1.85rem,5vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#1B1C1A]">
          Gate quote preview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B514D] sm:text-base">
          Read-only view of a saved gate configuration. Continue to contact when you are ready for a survey-led quote.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <ConfiguratorPreviewPanel config={config} />

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#1B1C1A]/10 bg-white px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6D615D]">Configuration</p>
            <dl className="mt-3 space-y-2 text-sm text-[#1B1C1A]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6D615D]">Gate type</dt>
                <dd className="font-heading font-bold uppercase">{gateTypeLabel(config.gateType)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6D615D]">Style</dt>
                <dd className="font-heading font-bold uppercase">{styleLabel(config.style)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6D615D]">Dimensions</dt>
                <dd className="font-heading font-bold uppercase">
                  {config.widthMm} × {config.heightMm} mm
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6D615D]">Finish</dt>
                <dd className="font-heading font-bold uppercase">{finishLabel(config.finish)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6D615D]">Estimate</dt>
                <dd className="text-right font-heading font-bold uppercase">
                  {formatPricingDisplayHeadline(pricing, pricingCopyVariant)}
                  <span className="mt-0.5 block">{formatPricingDisplayAmount(pricing, pricingCopyVariant)}</span>
                </dd>
              </div>
            </dl>
          </div>

          <ConfiguratorPriceSummary
            config={config}
            showActions={false}
            compact
            pricingCopyVariant={pricingCopyVariant}
          />

          <Link
            href={buildContactHandoffPath(shareToken)}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#9E000C] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#8A0009]"
          >
            Request survey-led quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>

          <Link
            href="/configurator"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#1B1C1A]/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A] transition hover:border-[#9E000C]/30 hover:text-[#9E000C]"
          >
            Open configurator
          </Link>
        </div>
      </div>
    </div>
  )
}
