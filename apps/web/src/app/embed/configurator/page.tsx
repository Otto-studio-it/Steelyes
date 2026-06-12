import type { Metadata } from 'next'
import { Suspense } from 'react'

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
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="h-40 animate-pulse rounded-[24px] border border-steel/10 bg-white/70" aria-hidden />
          </div>
        }
      >
        <ConfiguratorClient pricingCatalog={pricingCatalog} embed tenant={tenant ?? undefined} />
      </Suspense>
    </main>
  )
}
