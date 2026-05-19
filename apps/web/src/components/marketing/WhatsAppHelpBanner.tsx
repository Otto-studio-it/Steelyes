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
      className="fixed right-4 z-[45] w-[min(calc(100vw-2rem),23.75rem)] origin-bottom-right bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:right-5 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
      aria-live="polite"
    >
      <div
        role="dialog"
        aria-label="WhatsApp help"
        className="animate-chat-widget-in pointer-events-auto w-full"
      >
        <div className="relative rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute right-5 top-5 inline-flex h-6 w-6 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="flex gap-4">
            <WhatsAppIcon className="mt-0.5 h-10 w-10 shrink-0 text-[#25D366]" />

            <div className="min-w-0 flex-1 pr-5">
              <p className="font-heading text-base font-bold leading-snug text-[#1B1C1A]">
                We&apos;re here to help
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#666666]">
                Welcome to our site. If you need help, reply on WhatsApp — we&apos;re online and ready
                to assist.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                Reply on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
