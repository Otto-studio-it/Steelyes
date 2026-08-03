'use client'

import { useCallback, useEffect, useState } from 'react'

import { CookieBanner } from '@/components/marketing/CookieBanner'
import { MobileQuoteCTA } from '@/components/marketing/MobileQuoteCTA'
import { WhatsAppHelpBanner } from '@/components/marketing/WhatsAppHelpBanner'

const COOKIE_KEY = 'sy_cookie_consent'
const COOKIEBOT_ENABLED = Boolean(process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim())

type MarketingFloatingChromeProps = {
  /** Sticky quote bar — off on configurator */
  enableQuoteBar: boolean
}

/**
 * ponytail: one owner for bottom chrome so cookie / WhatsApp / quote never stack three-deep.
 * Priority: cookie (legal) → WhatsApp dialog → sticky quote.
 * When Cookiebot is configured, the native banner is skipped (Cookiebot owns CMP).
 */
export function MarketingFloatingChrome({ enableQuoteBar }: MarketingFloatingChromeProps) {
  const [cookieVisible, setCookieVisible] = useState(false)
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (COOKIEBOT_ENABLED) {
      setCookieVisible(false)
      setReady(true)
      return
    }
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
