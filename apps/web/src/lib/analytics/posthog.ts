'use client'

import posthog from 'posthog-js'

let initialized = false

export function initPostHog(): void {
  if (initialized || typeof window === 'undefined') {
    return
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

  if (!key) {
    return
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    persistence: 'localStorage+cookie',
  })
  initialized = true
}

export function captureConfiguratorEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return
  }

  if (!initialized) {
    initPostHog()
  }

  posthog.capture(event, {
    product: 'configurator',
    ...properties,
  })
}

export function identifyConfiguratorSession(distinctId: string): void {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return
  }

  if (!initialized) {
    initPostHog()
  }

  posthog.identify(distinctId)
}
