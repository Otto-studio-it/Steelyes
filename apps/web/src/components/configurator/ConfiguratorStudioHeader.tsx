'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { PriceDeltaChip } from '@/components/configurator/PriceDeltaChip'
import { usePriceDeltaFlash } from '@/hooks/usePriceDeltaFlash'
import { formatPricingDisplayAmount, formatPricingDisplayHeadline } from '@/lib/configurator/labels'
import { useConfiguratorPriceRevealed, useConfiguratorPricing } from '@/store/configuratorStore'

type ConfiguratorStudioHeaderProps = {
  embed?: boolean
}

export function ConfiguratorStudioHeader({ embed = false }: ConfiguratorStudioHeaderProps) {
  const pricing = useConfiguratorPricing()
  const priceRevealed = useConfiguratorPriceRevealed()
  const priceDeltaFlash = usePriceDeltaFlash(priceRevealed ? pricing.totalGbp : null)
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  // Client request: no amounts until the customer reaches the summary step.
  if (!priceRevealed) {
    return (
      <header className="border-b border-steel/10 bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="min-w-0">
            {!embed ? (
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Gate configurator</p>
            ) : null}
            <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel sm:text-base">
              All details
            </p>
          </div>
          <p className="px-2 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Price revealed at summary
          </p>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-steel/10 bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="min-w-0">
          {!embed ? (
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Gate configurator</p>
          ) : null}
          <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel sm:text-base">
            All details
          </p>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setBreakdownOpen((open) => !open)}
            className="group inline-flex min-h-[44px] flex-col items-end justify-center px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-expanded={breakdownOpen}
            aria-controls="configurator-price-breakdown"
          >
            <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted">
              {formatPricingDisplayHeadline(pricing, 'desktop')}
              {breakdownOpen ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              )}
            </span>
            <span className="inline-flex items-baseline gap-2">
              <span className="font-heading text-lg font-black uppercase tracking-tight text-steel sm:text-xl">
                {formatPricingDisplayAmount(pricing, 'desktop')}
              </span>
              <PriceDeltaChip label={priceDeltaFlash} />
            </span>
          </button>
        </div>
      </div>

      {breakdownOpen ? (
        <div id="configurator-price-breakdown" className="border-t border-steel/10 bg-white px-4 py-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ConfiguratorPriceSummary pricingCopyVariant="desktop" />
          </div>
        </div>
      ) : null}
    </header>
  )
}
