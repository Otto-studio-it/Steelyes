'use client'

import { useCallback, useEffect, useState } from 'react'

import { CookieBanner } from '@/components/marketing/CookieBanner'
import { MobileQuoteCTA } from '@/components/marketing/MobileQuoteCTA'
import { WhatsAppHelpBanner } from '@/components/marketing/WhatsAppHelpBanner'

const COOKIE_KEY = 'sy_cookie_consent'

type MarketingFloatingChromeProps = {
  /** Sticky quote bar — off on configurator */
  enableQuoteBar: boolean
}

/**
 * ponytail: one owner for bottom chrome so cookie / WhatsApp / quote never stack three-deep.
 * Priority: cookie (legal) → WhatsApp dialog → sticky quote.
 */
export function MarketingFloatingChrome({ enableQuoteBar }: MarketingFloatingChromeProps) {
  const [cookieVisible, setCookieVisible] = useState(false)
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setCookieVisible(!localStorage.getItem(COOKIE_KEY))
    } catch {
      setCookieVisible(false)
    }
    setReady(true)
  }, [])

  const handleCookieAccepted = useCallback(() => setCookieVisible(false), [])

  if (!ready) return null

  if (cookieVisible) {
    return <CookieBanner onAccepted={handleCookieAccepted} />
  }

  return (
    <>
      {enableQuoteBar && !whatsappOpen ? <MobileQuoteCTA /> : null}
      <WhatsAppHelpBanner onOpenChange={setWhatsappOpen} />
    </>
  )
}
