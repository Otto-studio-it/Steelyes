import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ConfiguratorLoadingScreen } from '@/components/configurator/ConfiguratorLoadingScreen'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { loadTenantBundle, resolveTenantId } from '@/lib/platform/load-tenant'

import { ConfiguratorClient } from '../../(marketing)/configurator/ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Steelyes gate configurator embed',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

async function EmbedConfiguratorWithCatalog({ tenantQuery }: { tenantQuery?: string }) {
  const pricingCatalog = await fetchPricingCatalog()
  const tenantId = resolveTenantId(tenantQuery)
  const tenant = loadTenantBundle(tenantId)

  return (
    <Suspense fallback={<ConfiguratorLoadingScreen />}>
      <ConfiguratorClient pricingCatalog={pricingCatalog} embed tenant={tenant ?? undefined} />
    </Suspense>
  )
}

export default function EmbedConfiguratorPage({
  searchParams,
}: {
  searchParams?: { tenant?: string }
}) {
  return (
    <main className="min-h-screen bg-canvas">
      <Suspense fallback={<ConfiguratorLoadingScreen />}>
        <EmbedConfiguratorWithCatalog tenantQuery={searchParams?.tenant} />
      </Suspense>
    </main>
  )
}
