'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { captureConfiguratorEvent, initPostHog } from '@/lib/analytics/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
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

  return children
}
