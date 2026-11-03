'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

// Extend global window to avoid conflicts with TurnstileWidget
declare global {
  interface Window {
    turnstileForm?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

/**
 * Turnstile widget for server action forms.
 * Renders the Cloudflare Turnstile challenge and automatically populates
 * the standard `cf-turnstile-response` hidden input that forms expect.
 */
export function TurnstileFormWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!ready || !siteKey || !containerRef.current) {
      return
    }

    // Use the global turnstile API (loaded by Cloudflare script)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turnstileApi = (window as any).turnstile
    if (!turnstileApi) {
      return
    }

    widgetIdRef.current = turnstileApi.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'light',
    })

    return () => {
      if (widgetIdRef.current && turnstileApi) {
        turnstileApi.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [ready, siteKey])

  if (!siteKey) {
    return null
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        data-cookieconsent="ignore"
      />
      <div ref={containerRef} className="min-h-[65px]" data-testid="turnstile-widget" />
    </>
  )
}
