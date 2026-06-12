import type { Metadata } from 'next'

import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { loadTenantBundle, resolveTenantId } from '@/lib/platform/load-tenant'

import { ConfiguratorClient } from '../../(marketing)/configurator/ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Steelyes gate configurator embed',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function EmbedConfiguratorPage({
  searchParams,
}: {
  searchParams?: { tenant?: string }
}) {
  const pricingCatalog = await fetchPricingCatalog()
  const tenantId = resolveTenantId(searchParams?.tenant)
  const tenant = loadTenantBundle(tenantId)

  return (
    <main className="min-h-screen bg-canvas">
      <ConfiguratorClient pricingCatalog={pricingCatalog} embed tenant={tenant ?? undefined} />
    </main>
  )
}
