'use client'

import { useEffect } from 'react'

import type { PricingCatalog } from '@steelyes/gate-engine'

import { ConfiguratorShell } from '@/components/configurator/ConfiguratorShell'
import { useConfiguratorStore } from '@/store/configuratorStore'

type ConfiguratorClientProps = {
  pricingCatalog?: PricingCatalog
}

export function ConfiguratorClient({ pricingCatalog }: ConfiguratorClientProps) {
  const hydrate = useConfiguratorStore((state) => state.hydrate)
  const hydrated = useConfiguratorStore((state) => state.hydrated)
  const setPricingCatalog = useConfiguratorStore((state) => state.setPricingCatalog)

  useEffect(() => {
    if (pricingCatalog) {
      setPricingCatalog(pricingCatalog)
    }
    hydrate()
  }, [hydrate, pricingCatalog, setPricingCatalog])

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="h-40 animate-pulse rounded-[24px] border border-steel/10 bg-white/70" aria-hidden />
        <p className="sr-only">Loading configurator…</p>
      </div>
    )
  }

  return <ConfiguratorShell />
}
