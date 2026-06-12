import type { Metadata } from 'next'

import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'

import { ConfiguratorClient } from '../../(marketing)/configurator/ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Steelyes gate configurator embed',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function EmbedConfiguratorPage() {
  const pricingCatalog = await fetchPricingCatalog()

  return (
    <main className="min-h-screen bg-canvas">
      <ConfiguratorClient pricingCatalog={pricingCatalog} embed />
    </main>
  )
}
