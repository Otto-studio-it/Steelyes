'use client'

import { useEffect, useRef } from 'react'

/**
 * Cookiebot cookie declaration — injects the declaration table into this slot
 * on /legal/cookie-policy (Cookiebot “Script della dichiarazione”).
 */
export function CookiebotDeclaration() {
  const hostRef = useRef<HTMLDivElement>(null)
  const id = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim()

  useEffect(() => {
    if (!id || !hostRef.current) return
    if (document.getElementById('CookieDeclaration')) return

    const script = document.createElement('script')
    script.id = 'CookieDeclaration'
    script.src = `https://consent.cookiebot.com/${id}/cd.js`
    script.type = 'text/javascript'
    script.async = true
    hostRef.current.appendChild(script)

    return () => {
      script.remove()
      const leftover = document.getElementById('CookieDeclaration')
      leftover?.remove()
    }
  }, [id])

  if (!id) {
    return (
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Cookiebot declaration will appear here once{' '}
        <code className="font-mono text-xs">NEXT_PUBLIC_COOKIEBOT_ID</code> is set in Coolify
        (Domain Group ID from the Cookiebot dashboard).
      </p>
    )
  }

  return <div ref={hostRef} className="cookiebot-declaration min-h-[120px]" />
}
