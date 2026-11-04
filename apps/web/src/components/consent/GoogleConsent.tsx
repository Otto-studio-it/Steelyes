'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { onConsent, loadConsent } from '@/lib/consent/useConsent'

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim()

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

export function GoogleConsentModeScript() {
  return (
    <script
      id="google-consent-default"
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});
        `.trim(),
      }}
    />
  )
}

export function GoogleAdsTag() {
  const consent = typeof window !== 'undefined' ? loadConsent() : null
  const marketingConsent = consent?.categories.marketing ?? false

  useEffect(() => {
    const unsubscribe = onConsent((state) => {
      gtag('consent', 'update', {
        ad_storage: state.categories.marketing ? 'granted' : 'denied',
        ad_user_data: state.categories.marketing ? 'granted' : 'denied',
        ad_personalization: state.categories.marketing ? 'granted' : 'denied',
        analytics_storage: state.categories.analytics ? 'granted' : 'denied',
      })
    })

    return unsubscribe
  }, [])

  if (!GOOGLE_ADS_ID) {
    return null
  }

  if (!marketingConsent) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
          `.trim(),
        }}
      />
    </>
  )
}
