import { NextResponse } from 'next/server'

import {
  buildIndicativeQuotePdf,
  buildQuotePdfFilename,
  calculateQuotePricing,
} from '@/lib/configurator/quote-pdf'
import { gateConfigFromConfigurationRow } from '@/lib/configurator/configuration-db'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { buildQuoteSharePath, isValidShareToken } from '@/lib/configurator/share-token'
import { env } from '@/lib/env'
import { createTtlLru } from '@/lib/server/ttl-lru'
import { checkRateLimit, clientKeyFromHeaders, RATE_LIMIT_MESSAGE, RATE_LIMITS } from '@/lib/security/rate-limit'
import { getServiceRoleClient } from '@/lib/supabase/server'

// A saved design never changes; the TTL only bounds how long an admin price edit takes to show.
const pdfCache = createTtlLru<Uint8Array>({ maxEntries: 40, ttlMs: 5 * 60_000 })

type RouteContext = {
  params: { shareToken: string }
}

export async function GET(request: Request, context: RouteContext) {
  const { shareToken } = context.params

  // Every hit rasterises the design and builds a PDF — throttle before touching the DB.
  const limit = checkRateLimit(RATE_LIMITS.quotePdf, clientKeyFromHeaders(request.headers))
  if (!limit.ok) {
    return NextResponse.json(
      { error: RATE_LIMIT_MESSAGE },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  if (!isValidShareToken(shareToken)) {
    return NextResponse.json({ error: 'Invalid share token' }, { status: 400 })
  }

  let pdfBytes = pdfCache.get(shareToken)

  if (!pdfBytes) {
    try {
      const supabase = getServiceRoleClient()
      const { data: row, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('share_token', shareToken)
        .maybeSingle()

      if (error || !row) {
        return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
      }

      // Throws on rows saved with option / finish codes that no longer exist.
      const config = gateConfigFromConfigurationRow(row)
      const pricingCatalog = await fetchPricingCatalog()
      const pricing = calculateQuotePricing(config, pricingCatalog)
      const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk'
      const shareUrl = `${siteUrl}${buildQuoteSharePath(shareToken)}`

      pdfBytes = await buildIndicativeQuotePdf({ config, pricing, shareToken, shareUrl })
      pdfCache.set(shareToken, pdfBytes)
    } catch (error) {
      console.error('Quote PDF build failed:', error)
      return NextResponse.json({ error: 'Could not build the quote PDF. Please try again.' }, { status: 500 })
    }
  }

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${buildQuotePdfFilename(shareToken)}"`,
      'Cache-Control': 'private, max-age=60',
    },
  })
}
