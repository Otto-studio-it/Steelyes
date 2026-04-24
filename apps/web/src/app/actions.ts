'use server'

import { headers } from 'next/headers'
import { getPostHogClient } from '@/lib/posthog'

export async function trackGetQuoteClicked() {
  const headersList = headers()
  const distinctId = headersList.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous'
  getPostHogClient().capture({
    distinctId,
    event: 'get quote clicked',
    properties: {
      $current_url: '/',
    },
  })
}

export async function trackCatalogueViewed() {
  const headersList = headers()
  const distinctId = headersList.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous'
  getPostHogClient().capture({
    distinctId,
    event: 'catalogue viewed',
    properties: {
      $current_url: '/',
    },
  })
}
