'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { captureConfiguratorEvent, initPostHog } from '@/lib/analytics/posthog'

/**
 * Tracks pageviews only — renders nothing.
 *
 * Must be mounted as a SIBLING of page content, never a parent/wrapper.
 * useSearchParams() forces the nearest Suspense boundary to resolve
 * client-side on statically-rendered routes; wrapping {children} in this
 * component previously meant the whole page's server-rendered HTML was
 * replaced by the Suspense fallback (effectively shipping an empty shell
 * until hydration) instead of just this invisible tracker.
 */
export function PostHogProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return
    }

    captureConfiguratorEvent('page viewed', {
      path: pathname,
      search: searchParams.toString() || null,
    })
  }, [pathname, searchParams])

  return null
}
