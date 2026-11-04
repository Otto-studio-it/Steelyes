'use client'

import { useState, useEffect } from 'react'
import { useConsent } from '@/lib/consent/useConsent'

export function ConsentSettings() {
  const { consent, loading, acceptAll, rejectAll, updateConsent } = useConsent()
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    if (consent) {
      setPreferences(consent.categories)
    }
  }, [consent])

  if (loading) {
    return (
      <div className="rounded border border-zinc-200 bg-zinc-50 px-6 py-4 text-sm text-zinc-700">
        Loading preferences...
      </div>
    )
  }

  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-4 font-heading text-lg font-bold uppercase text-steel">Manage Cookie Preferences</h3>
      
      <div className="space-y-5">
        <div className="rounded border border-zinc-300 bg-white px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="mb-1 font-semibold text-steel">Necessary Cookies</p>
              <p className="text-xs leading-relaxed text-zinc-600">
                Essential for the website to function. These cannot be disabled.
              </p>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">Always On</div>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-4 rounded border border-zinc-300 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={preferences.analytics}
            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary"
          />
          <div className="flex-1">
            <p className="mb-1 font-semibold text-steel">Analytics</p>
            <p className="text-xs leading-relaxed text-zinc-600">
              Help us understand how visitors use our website. No personal data is collected.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-4 rounded border border-zinc-300 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary"
          />
          <div className="flex-1">
            <p className="mb-1 font-semibold text-steel">Marketing</p>
            <p className="text-xs leading-relaxed text-zinc-600">
              Used to deliver targeted advertising and measure campaign effectiveness.
            </p>
          </div>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => updateConsent(preferences)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center bg-primary px-6 font-heading text-sm font-bold uppercase tracking-tight text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Save Preferences
        </button>
        <button
          type="button"
          onClick={acceptAll}
          className="inline-flex min-h-[44px] items-center justify-center border border-zinc-400 px-6 font-heading text-sm font-bold uppercase tracking-tight text-steel hover:border-steel hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={rejectAll}
          className="inline-flex min-h-[44px] items-center justify-center border border-zinc-400 px-6 font-heading text-sm font-bold uppercase tracking-tight text-steel hover:border-steel hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Reject All
        </button>
      </div>

      {consent && (
        <p className="mt-4 text-xs text-zinc-500">
          Last updated: {new Date(consent.timestamp).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  )
}
