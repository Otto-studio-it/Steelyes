'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6D615D]">Indicative total</p>
          <p className="truncate font-heading text-lg font-black uppercase tracking-tight text-[#1B1C1A]">
            {pricing.totalLabel}
          </p>
        </div>

        {isLast ? (
          <Link
            href="/contact"
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9E000C] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#8A0009]"
          >
            Request quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1B1C1A] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#9E000C]"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}
