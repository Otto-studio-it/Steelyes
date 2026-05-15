'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'sy_whatsapp_help_dismissed'
const DELAY_MS = 10_000

const WHATSAPP_NUMBER = '447803002145'
const WHATSAPP_PREFILL =
  'Hello, I visited the Steelyes website and would like some help. [Steelyes-web]'

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function WhatsAppHelpBanner() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/contact') return

    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [pathname])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed')
    } catch {}
    setOpen(false)
  }

  if (pathname === '/contact' || !open) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[45] flex justify-end px-3 pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-4 sm:px-0 sm:pb-6"
      aria-live="polite"
    >
      <div
        role="dialog"
        aria-label="WhatsApp help"
        className="animate-chat-widget-in pointer-events-auto w-full max-w-[min(100%,15rem)] origin-bottom-right"
      >
        <div className="overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_12px_32px_-10px_rgba(0,0,0,0.22)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/80 px-2.5 py-2">
            <div className="relative shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-[#22c55e] animate-chat-online-pulse"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[11px] font-bold uppercase tracking-wide text-[#1B1C1A]">
                Steelyes Team
              </p>
              <p className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-[#25D366]">
                <span className="inline-block h-1 w-1 rounded-full bg-[#25D366] animate-chat-online-pulse" />
                Online
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200/80 hover:text-zinc-700"
            >
              <span className="text-sm leading-none">×</span>
            </button>
          </div>

          <div className="space-y-2 px-2.5 py-2">
            <div className="relative max-w-[95%] rounded-lg rounded-bl-sm bg-[#F4F4F5] px-2 py-1 text-[9px] leading-tight text-[#52525B]">
              <p>
                Welcome to our site, if you need help simply reply to this message, we are online and ready to help.
              </p>
              <span
                className="absolute -bottom-0.5 left-2 h-2 w-2 rotate-45 bg-[#F4F4F5]"
                aria-hidden
              />
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full min-h-[34px] items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 font-heading text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all duration-200 hover:bg-[#1ebe57] active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              Reply on WhatsApp
            </a>

            <button
              type="button"
              onClick={dismiss}
              className="w-full py-0.5 text-center font-mono text-[8px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-zinc-600"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}