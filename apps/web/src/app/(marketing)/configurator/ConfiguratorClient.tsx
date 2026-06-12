'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import type { PricingCatalog, TenantBundle } from '@steelyes/gate-engine'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { TenantBrandingProvider } from '@/components/platform/TenantBrandingProvider'
import { ConfiguratorShell } from '@/components/configurator/ConfiguratorShell'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { isValidShareToken } from '@/lib/configurator/share-token'
import { useConfiguratorStore } from '@/store/configuratorStore'

type ConfiguratorClientProps = {
  pricingCatalog?: PricingCatalog
  embed?: boolean
  tenant?: TenantBundle
}

export function ConfiguratorClient({ pricingCatalog, embed = false, tenant }: ConfiguratorClientProps) {
  const searchParams = useSearchParams()
  const hydrate = useConfiguratorStore((state) => state.hydrate)
  const hydrated = useConfiguratorStore((state) => state.hydrated)
  const setPricingCatalog = useConfiguratorStore((state) => state.setPricingCatalog)
  const setConfig = useConfiguratorStore((state) => state.setConfig)

  useEffect(() => {
    const catalog = tenant?.catalog ?? pricingCatalog
    if (catalog) {
      setPricingCatalog(catalog)
    }
    hydrate()
  }, [hydrate, pricingCatalog, setPricingCatalog, tenant?.catalog])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    const shareToken = searchParams.get('shareToken')?.trim()
    if (!shareToken || !isValidShareToken(shareToken)) {
      return
    }

    void loadGateConfigurationByShareToken(shareToken).then((config) => {
      if (!config) {
        return
      }

      setConfig(config)
      captureConfiguratorEvent('configuration loaded from share token', { share_token: shareToken })
    })
  }, [hydrated, searchParams, setConfig])

  if (!hydrated) {
    return (
      <div className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 ${embed ? 'py-6' : ''}`}>
        <div className="h-40 animate-pulse rounded-[24px] border border-steel/10 bg-white/70" aria-hidden />
        <p className="sr-only">Loading configurator…</p>
      </div>
    )
  }

  const shell = <ConfiguratorShell embed={embed} tenant={tenant} />

  if (tenant) {
    return <TenantBrandingProvider tenant={tenant}>{shell}</TenantBrandingProvider>
  }

  return shell
}
