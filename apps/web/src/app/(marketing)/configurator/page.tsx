import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'

import { ConfiguratorClient } from './ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Gate configurator',
  description:
    'Configure a steel gate in 2D, compare indicative pricing, and prepare a survey-led quote with a live schematic preview.',
}

export const dynamic = 'force-dynamic'

export default async function ConfiguratorPage() {
  const pricingCatalog = await fetchPricingCatalog()

  return (
    <MarketingShell pathname="/configurator">
      <ConfiguratorClient pricingCatalog={pricingCatalog} />
    </MarketingShell>
  )
}
