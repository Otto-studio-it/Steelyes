'use client'

import { useEffect } from 'react'

import { ConfiguratorShell } from '@/components/configurator/ConfiguratorShell'
import { useConfiguratorStore } from '@/store/configuratorStore'

export function ConfiguratorClient() {
  const hydrate = useConfiguratorStore((state) => state.hydrate)
  const hydrated = useConfiguratorStore((state) => state.hydrated)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="h-40 animate-pulse rounded-[24px] border border-[#1B1C1A]/10 bg-white/70" aria-hidden />
        <p className="sr-only">Loading configurator…</p>
      </div>
    )
  }

  return <ConfiguratorShell />
}
