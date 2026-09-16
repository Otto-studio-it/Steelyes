'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  DEFAULT_PRICING_CATALOG,
  calculateIndicativeGatePrice,
  type GateConfig,
  type PricingCatalog,
} from '@steelyes/gate-engine'

import { ConfigurationSummary } from '@/components/configurator/ConfigurationSummary'
import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { PreviewCanvas } from '@/components/configurator/PreviewCanvas'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { buildContactHandoffPath, buildQuotePdfPath } from '@/lib/configurator/share-token'
import {
  formatPricingDisplayAmount,
  formatPricingDisplayHeadline,
  type PricingCopyVariant,
} from '@/lib/configurator/labels'

type QuoteShareViewProps = {
  config: GateConfig
  shareToken: string
  pricingCatalog?: PricingCatalog
}

export function QuoteShareView({
  config,
  shareToken,
  pricingCatalog = DEFAULT_PRICING_CATALOG,
}: QuoteShareViewProps) {
  const pricing = calculateIndicativeGatePrice(config, pricingCatalog)
  const viewport = useConfiguratorViewport()
  const pricingCopyVariant: PricingCopyVariant = viewport.mode === 'desktop' ? 'desktop' : 'mobile'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]">
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Shared configuration</p>
        <h1 className="mt-2 font-heading text-[clamp(1.85rem,5vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-steel">
          Gate quote preview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-deep sm:text-base">
          Read-only view of a saved gate configuration. Continue to contact when you are ready for a survey-led quote.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <PreviewCanvas config={config} allowColourFit={false} />

        <div className="space-y-5">
          <div className="rounded-2xl border border-steel/10 bg-white px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Configuration</p>
            <ConfigurationSummary config={config} />
            <p className="mt-3 text-right font-heading text-sm font-bold uppercase text-steel">
              {formatPricingDisplayHeadline(pricing, pricingCopyVariant)}
              <span className="mt-0.5 block">{formatPricingDisplayAmount(pricing, pricingCopyVariant)}</span>
            </p>
          </div>

          <ConfiguratorPriceSummary
            config={config}
            compact
            pricingCopyVariant={pricingCopyVariant}
            pricingCatalog={pricingCatalog}
          />

          <Link
            href={buildContactHandoffPath(shareToken)}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark"
          >
            Request survey-led quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>

          <a
            href={buildQuotePdfPath(shareToken)}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
            download
          >
            Download estimate PDF
          </a>

          <Link
            href="/configurator"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
          >
            Open configurator
          </Link>
        </div>
      </div>
    </div>
  )
}
