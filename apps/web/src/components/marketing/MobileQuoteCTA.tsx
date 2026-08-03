'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function MobileQuoteCTA() {
  const [visible, setVisible] = useState(false)
  const footerRef = useRef<Element | null>(null)

  useEffect(() => {
    footerRef.current = document.querySelector('footer')

    const handler = () => {
      const scrolled = window.scrollY > 500
      const nearFooter = footerRef.current
        ? footerRef.current.getBoundingClientRect().top < window.innerHeight + 100
        : false
      setVisible(scrolled && !nearFooter)
    }

    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      data-testid="mobile-conversion-bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-2 px-4 pt-3">
        <Link
          href="/configurator"
          className="inline-flex min-h-[52px] w-full items-center justify-center bg-steel px-2 text-center font-heading text-xs font-bold uppercase tracking-tight text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        >
          Configure gate
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-[52px] w-full items-center justify-center bg-primary px-2 text-center font-heading text-xs font-bold uppercase tracking-tight text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Request a quote
        </Link>
      </div>
    </div>
  )
}
