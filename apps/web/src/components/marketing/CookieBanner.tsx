'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'sy_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch {
      // localStorage blocked (private browsing, etc.) — don't show banner
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-[#1B1C1A] px-4 py-4 md:px-8 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-md lg:border lg:border-zinc-700"
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#9E000C]">Cookie notice</p>
      <p className="text-xs leading-relaxed text-zinc-300">
        This site uses strictly necessary cookies only — no analytics, no tracking. A single preference cookie
        records that you have seen this notice.{' '}
        <Link href="/legal/cookie-policy" className="underline underline-offset-2 hover:text-white">
          Cookie Policy
        </Link>
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={accept}
          className="inline-flex min-h-[40px] items-center justify-center bg-[#9E000C] px-5 font-heading text-xs font-bold uppercase tracking-[0.1em] text-white"
        >
          Got it
        </button>
        <Link
          href="/legal/cookie-policy"
          className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
        >
          Learn more
        </Link>
      </div>
    </div>
  )
}
