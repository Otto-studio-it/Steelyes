'use client'

import { ArrowRight } from 'lucide-react'

import { ConfiguratorQuoteHandoffButton } from '@/components/configurator/ConfiguratorQuoteHandoffButton'
import { formatPricingDisplayAmount, formatPricingDisplayHeadline } from '@/lib/configurator/labels'
import { useConfiguratorPricing, useConfiguratorStep, useConfiguratorStore } from '@/store/configuratorStore'

type ConfiguratorPriceBarProps = {
  className?: string
}

export function ConfiguratorPriceBar({ className = '' }: ConfiguratorPriceBarProps) {
  const pricing = useConfiguratorPricing()
  const { isLast } = useConfiguratorStep()
  const nextStep = useConfiguratorStore((state) => state.nextStep)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#1B1C1A]/10 bg-white/95 backdrop-blur-md lg:hidden ${className}`}
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto max-w-7xl pt-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6D615D]">
            {formatPricingDisplayHeadline(pricing, 'mobile')}
          </p>
          <p className="truncate font-heading text-xl font-black uppercase tracking-tight text-[#1B1C1A]">
            {formatPricingDisplayAmount(pricing, 'mobile')}
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-4 text-[#6D615D]">{pricing.disclaimer}</p>
        </div>

        <div className="mt-3">
          {isLast ? (
            <ConfiguratorQuoteHandoffButton className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#9E000C] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#8A0009] disabled:opacity-60" />
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1C1A] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#9E000C]"
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
