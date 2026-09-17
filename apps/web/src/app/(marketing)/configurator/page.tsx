import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ConfiguratorLoadingScreen } from '@/components/configurator/ConfiguratorLoadingScreen'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { breadcrumbSchema } from '@/lib/marketing/schema'

import { ConfiguratorClient } from './ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Gate Configurator | Live Preview & Estimated Price',
  description:
    'Design a made-to-measure steel gate online, explore mechanisms, finishes and dimensions, and see a live preview with estimated pricing before site survey.',
  alternates: { canonical: '/configurator' },
}

export const dynamic = 'force-dynamic'

async function ConfiguratorWithCatalog() {
  const pricingCatalog = await fetchPricingCatalog()

  return (
    <Suspense fallback={<ConfiguratorLoadingScreen />}>
      <ConfiguratorClient pricingCatalog={pricingCatalog} />
    </Suspense>
  )
}

export default function ConfiguratorPage() {
  return (
    <MarketingShell pathname="/configurator">
      <Suspense fallback={<ConfiguratorLoadingScreen />}>
        <ConfiguratorWithCatalog />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Configurator', path: '/configurator' }]),
          ),
        }}
      />
    </MarketingShell>
  )
}
