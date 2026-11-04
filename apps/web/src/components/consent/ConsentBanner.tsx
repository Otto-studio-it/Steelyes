'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useConsent } from '@/lib/consent/useConsent'

export function ConsentBanner() {
  const { consent, loading, acceptAll, rejectAll, updateConsent } = useConsent()
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  })

  // Don't show if consent already given or still loading
  if (loading || consent !== null) {
    return null
  }

  if (showPreferences) {
    return (
      <div
        role="dialog"
        aria-label="Cookie preferences"
        aria-live="polite"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-steel px-4 py-4 md:px-8 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-xl lg:border lg:border-zinc-700 lg:py-6"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Cookie Preferences</h2>
        
        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <p className="mb-2 font-semibold text-white">Necessary Cookies</p>
            <p className="text-xs leading-relaxed">
              Essential for the website to function. These cannot be disabled.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">Analytics</p>
              <p className="text-xs leading-relaxed">
                Help us understand how visitors use our website. No personal data is collected.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">Marketing</p>
              <p className="text-xs leading-relaxed">
                Used to deliver targeted advertising and measure campaign effectiveness.
              </p>
            </div>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              updateConsent(preferences)
            }}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center bg-primary px-5 font-heading text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Save Preferences
          </button>
          <button
            type="button"
            onClick={() => setShowPreferences(false)}
            className="inline-flex min-h-[44px] items-center justify-center px-5 font-mono text-xs uppercase tracking-widest text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-steel px-4 py-4 md:px-8 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-md lg:border lg:border-zinc-700 lg:py-5"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">We value your privacy</p>
      <p className="mb-4 text-sm leading-relaxed text-zinc-300">
        We use cookies to improve your experience. You can accept all cookies, reject optional cookies, or manage your preferences.{' '}
        <Link href="/legal/cookie-policy" className="text-primary underline underline-offset-2 hover:text-white">
          Cookie Policy
        </Link>
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={acceptAll}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center bg-primary px-5 font-heading text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={rejectAll}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-white/35 px-5 font-heading text-xs font-bold uppercase tracking-[0.1em] text-white hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Reject All
        </button>
      </div>
      
      <button
        type="button"
        onClick={() => setShowPreferences(true)}
        className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
      >
        Manage Preferences
      </button>
    </div>
  )
}
