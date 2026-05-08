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

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="px-4 pt-3">
        <Link
          href="/contact"
          className="inline-flex w-full min-h-[52px] items-center justify-center bg-[#9E000C] font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515]"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  )
}
