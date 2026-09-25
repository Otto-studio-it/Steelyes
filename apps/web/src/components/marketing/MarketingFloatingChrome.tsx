'use client'

import { useCallback, useEffect, useState } from 'react'

import { CookieBanner } from '@/components/marketing/CookieBanner'
import { MobileQuoteCTA } from '@/components/marketing/MobileQuoteCTA'

const COOKIE_KEY = 'sy_cookie_consent'
const COOKIEBOT_ENABLED = Boolean(process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim())
const COOKIEBOT_TIMEOUT_MS = 5000

declare global {
  interface Window {
    Cookiebot?: {
      consented?: boolean
      declined?: boolean
      renew?: () => void
    }
    CookiebotOnLoad?: () => void
    CookiebotOnDialogInit?: () => void
  }
}

type MarketingFloatingChromeProps = {
  /** Sticky quote bar — off on configurator */
  enableQuoteBar: boolean
}

/**
 * One owner for bottom chrome so legal consent and the quote action never stack.
 * Priority: cookie (legal) → sticky quote.
 * When Cookiebot is configured, fallback banner shows until Cookiebot loads or times out.
 */
export function MarketingFloatingChrome({ enableQuoteBar }: MarketingFloatingChromeProps) {
  const [cookieVisible, setCookieVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [cookiebotActive, setCookiebotActive] = useState(false)

  useEffect(() => {
    if (!COOKIEBOT_ENABLED) {
      // No Cookiebot: show fallback if user hasn't accepted
      try {
        setCookieVisible(!localStorage.getItem(COOKIE_KEY))
      } catch {
        setCookieVisible(false)
      }
      setReady(true)
      return
    }

    // Cookiebot enabled: wait for it to load, only show fallback after timeout
    const checkCookiebot = () => {
      if (window.Cookiebot && typeof window.Cookiebot.consented !== 'undefined') {
        setCookiebotActive(true)
        setCookieVisible(false)
        return true
      }
      return false
    }

    // Check immediately
    if (checkCookiebot()) {
      setReady(true)
      return
    }

    // Don't show fallback yet - wait for timeout
    setReady(true)

    // Listen for Cookiebot load events
    const onLoad = () => {
      if (checkCookiebot()) return
      // Give Cookiebot a moment to initialize
      setTimeout(checkCookiebot, 100)
    }

    window.CookiebotOnLoad = onLoad
    window.CookiebotOnDialogInit = onLoad

    // Timeout: if Cookiebot doesn't load, show fallback
    const timeout = setTimeout(() => {
      if (!checkCookiebot()) {
        // Cookiebot failed to load, show fallback banner
        if (process.env.NODE_ENV === 'development') {
          console.warn('Cookiebot did not load within timeout, showing fallback')
        }
        try {
          setCookieVisible(!localStorage.getItem(COOKIE_KEY))
        } catch {
          setCookieVisible(false)
        }
      }
    }, COOKIEBOT_TIMEOUT_MS)

    // Poll for window.Cookiebot in case events don't fire
    const pollInterval = setInterval(() => {
      if (checkCookiebot()) clearInterval(pollInterval)
    }, 500)

    return () => {
      clearTimeout(timeout)
      clearInterval(pollInterval)
      delete window.CookiebotOnLoad
      delete window.CookiebotOnDialogInit
    }
  }, [])

  const handleCookieAccepted = useCallback(() => setCookieVisible(false), [])

  if (!ready) return null

  // Hide fallback if Cookiebot is active
  if (COOKIEBOT_ENABLED && cookiebotActive) {
    return enableQuoteBar ? <MobileQuoteCTA /> : null
  }

  if (cookieVisible) {
    return <CookieBanner onAccepted={handleCookieAccepted} />
  }

  return enableQuoteBar ? <MobileQuoteCTA /> : null
}
