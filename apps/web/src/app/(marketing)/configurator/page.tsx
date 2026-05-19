import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'

import { ConfiguratorClient } from './ConfiguratorClient'

export const metadata: Metadata = {
  title: 'Gate configurator',
  description:
    'Configure a steel gate in 2D, compare indicative pricing, and prepare a survey-led quote with a live schematic preview.',
}

export default function ConfiguratorPage() {
  return (
    <MarketingShell pathname="/configurator">
      <ConfiguratorClient />
    </MarketingShell>
  )
}
