'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'sy_cookie_consent'

type CookieBannerProps = {
  /** When provided, parent owns mount lifecycle (MarketingFloatingChrome). */
  onAccepted?: () => void
}

export function CookieBanner({ onAccepted }: CookieBannerProps) {
  const [visible, setVisible] = useState(Boolean(onAccepted))

  useEffect(() => {
    if (onAccepted) return
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch {
      // localStorage blocked — don't show banner
    }
  }, [onAccepted])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setVisible(false)
    onAccepted?.()
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed bottom-[var(--cfg-actionbar-h,0px)] left-0 right-0 z-50 border-t border-zinc-200 bg-steel px-4 py-3 md:px-8 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-md lg:border lg:border-zinc-700 lg:py-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <p className="mb-1 hidden font-mono text-xs uppercase tracking-widest text-primary lg:block">Cookie notice</p>
      <p className="text-xs leading-relaxed text-zinc-300">
        This site uses strictly necessary cookies only — no analytics, no tracking. A single preference cookie
        records that you have seen this notice.{' '}
        <Link href="/legal/cookie-policy" className="underline underline-offset-2 hover:text-white">
          Cookie Policy
        </Link>
      </p>
      <div className="mt-3 flex items-center gap-3 lg:mt-4">
        <button
          type="button"
          onClick={accept}
          className="inline-flex min-h-[44px] items-center justify-center bg-primary px-5 font-heading text-xs font-bold uppercase tracking-[0.1em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Got it
        </button>
        <Link
          href="/legal/cookie-policy"
          className="hidden min-h-[44px] items-center font-mono text-xs uppercase tracking-widest text-zinc-400 underline underline-offset-2 hover:text-zinc-200 lg:inline-flex"
        >
          Learn more
        </Link>
      </div>
    </div>
  )
}
