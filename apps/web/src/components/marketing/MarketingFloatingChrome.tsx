'use client'

import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { GoogleAdsTag } from '@/components/consent/GoogleConsent'
import { MobileQuoteCTA } from '@/components/marketing/MobileQuoteCTA'

type MarketingFloatingChromeProps = {
  /** Sticky quote bar — off on configurator */
  enableQuoteBar: boolean
}

/**
 * One owner for bottom chrome so legal consent and the quote action never stack.
 * Priority: cookie (legal) → sticky quote.
 */
export function MarketingFloatingChrome({ enableQuoteBar }: MarketingFloatingChromeProps) {
  return (
    <>
      <ConsentBanner />
      <GoogleAdsTag />
      {enableQuoteBar && <MobileQuoteCTA />}
    </>
  )
}
