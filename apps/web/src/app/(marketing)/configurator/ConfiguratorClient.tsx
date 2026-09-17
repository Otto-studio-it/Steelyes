'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import {
  GATE_TYPES,
  createGateConfig,
  createGatePreset,
  type GateType,
  type PricingCatalog,
  type TenantBundle,
} from '@steelyes/gate-engine'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { ConfiguratorLoadingScreen } from '@/components/configurator/ConfiguratorLoadingScreen'
import { TenantBrandingProvider } from '@/components/platform/TenantBrandingProvider'
import { ConfiguratorShell } from '@/components/configurator/ConfiguratorShell'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { getGateTypeAvailability } from '@/lib/configurator/gate-type-availability'
import { isValidShareToken } from '@/lib/configurator/share-token'
import { useConfiguratorStore } from '@/store/configuratorStore'

function parseGateTypeParam(value: string | null): GateType | null {
  if (!value) {
    return null
  }
  return (GATE_TYPES as readonly string[]).includes(value) ? (value as GateType) : null
}

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

  const appliedDeepLinkRef = useRef(false)

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
    if (shareToken && isValidShareToken(shareToken)) {
      if (appliedDeepLinkRef.current) {
        return
      }
      appliedDeepLinkRef.current = true
      void loadGateConfigurationByShareToken(shareToken).then((config) => {
        if (!config) {
          return
        }

        setConfig(config)
        captureConfiguratorEvent('configuration loaded from share token', { share_token: shareToken })
      })
      return
    }

    // Deep-link from marketing CTAs — apply once. Re-running on searchParams
    // identity changes was resetting the customer's mechanism after they changed it.
    const gateType = parseGateTypeParam(searchParams.get('gate'))
    if (!gateType || getGateTypeAvailability(gateType) === 'enquire') {
      return
    }

    if (appliedDeepLinkRef.current) {
      return
    }
    appliedDeepLinkRef.current = true

    setConfig(createGateConfig(createGatePreset(gateType)))
    captureConfiguratorEvent('configuration loaded from gate query', { gate_type: gateType })
  }, [hydrated, searchParams, setConfig])

  if (!hydrated) {
    return <ConfiguratorLoadingScreen />
  }

  const shell = <ConfiguratorShell embed={embed} tenant={tenant} />

  if (tenant) {
    return <TenantBrandingProvider tenant={tenant}>{shell}</TenantBrandingProvider>
  }

  return shell
}
