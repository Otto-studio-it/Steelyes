import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { QuoteShareView } from '@/components/configurator/QuoteShareView'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { isValidShareToken } from '@/lib/configurator/share-token'

type QuoteSharePageProps = {
  params: {
    shareToken: string
  }
}

export async function generateMetadata({ params }: QuoteSharePageProps): Promise<Metadata> {
  return {
    title: 'Shared gate configuration',
    description: 'Read-only preview of a saved Steelyes gate configuration and indicative pricing.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function QuoteSharePage({ params }: QuoteSharePageProps) {
  const shareToken = decodeURIComponent(params.shareToken)

  if (!isValidShareToken(shareToken)) {
    notFound()
  }

  const config = await loadGateConfigurationByShareToken(shareToken)

  if (!config) {
    notFound()
  }

  return (
    <MarketingShell pathname={`/quote/${shareToken}`}>
      <QuoteShareView config={config} shareToken={shareToken} />
    </MarketingShell>
  )
}
