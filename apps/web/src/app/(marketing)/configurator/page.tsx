import type { Metadata } from 'next'
import { Suspense } from 'react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'

import { ConfiguratorClient } from './ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Gate Configurator | Live Preview & Estimated Price',
  description:
    'Design a made-to-measure steel gate online, explore mechanisms, finishes and dimensions, and see a live preview with estimated pricing before site survey.',
  alternates: { canonical: '/configurator' },
}

export const dynamic = 'force-dynamic'

export default async function ConfiguratorPage() {
  const pricingCatalog = await fetchPricingCatalog()

  return (
    <MarketingShell pathname="/configurator">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-40 animate-pulse rounded-[24px] border border-steel/10 bg-white/70" aria-hidden /></div>}>
        <ConfiguratorClient pricingCatalog={pricingCatalog} />
      </Suspense>
    </MarketingShell>
  )
}
