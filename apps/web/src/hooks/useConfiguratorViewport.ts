'use client'

import { useEffect, useState } from 'react'

export type ConfiguratorViewportMode = 'portrait-phone' | 'landscape-phone' | 'tablet' | 'desktop'

export type ConfiguratorViewport = {
  mode: ConfiguratorViewportMode
  isPortraitPhone: boolean
  isLandscapePhone: boolean
  /** Phones + tablet — Quick Path default surface. Desktop stays Design Studio. */
  isMobileQuickEligible: boolean
  /** False until the client media queries have run — avoids an SSR desktop flash on phones. */
  ready: boolean
}

const DESKTOP_QUERY = '(min-width: 1024px)'
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)'
const LANDSCAPE_PHONE_QUERY = '(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)'

function resolveViewport(ready: boolean): ConfiguratorViewport {
  if (typeof window === 'undefined') {
    return {
      mode: 'desktop',
      isPortraitPhone: false,
      isLandscapePhone: false,
      isMobileQuickEligible: false,
      ready: false,
    }
  }

  if (window.matchMedia(DESKTOP_QUERY).matches) {
    return {
      mode: 'desktop',
      isPortraitPhone: false,
      isLandscapePhone: false,
      isMobileQuickEligible: false,
      ready,
    }
  }

  if (window.matchMedia(LANDSCAPE_PHONE_QUERY).matches) {
    return {
      mode: 'landscape-phone',
      isPortraitPhone: false,
      isLandscapePhone: true,
      isMobileQuickEligible: true,
      ready,
    }
  }

  if (window.matchMedia(TABLET_QUERY).matches) {
    return {
      mode: 'tablet',
      isPortraitPhone: false,
      isLandscapePhone: false,
      // ponytail: tablet had worst density with full studio — use Quick Path
      isMobileQuickEligible: true,
      ready,
    }
  }

  return {
    mode: 'portrait-phone',
    isPortraitPhone: true,
    isLandscapePhone: false,
    isMobileQuickEligible: true,
    ready,
  }
}

export function useConfiguratorViewport(): ConfiguratorViewport {
  const [viewport, setViewport] = useState<ConfiguratorViewport>(() => resolveViewport(false))

  useEffect(() => {
    const update = () => setViewport(resolveViewport(true))
    update()

    const mediaQueries = [
      window.matchMedia(DESKTOP_QUERY),
      window.matchMedia(TABLET_QUERY),
      window.matchMedia(LANDSCAPE_PHONE_QUERY),
      window.matchMedia('(orientation: portrait)'),
      window.matchMedia('(orientation: landscape)'),
    ]

    for (const query of mediaQueries) {
      query.addEventListener('change', update)
    }

    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      for (const query of mediaQueries) {
        query.removeEventListener('change', update)
      }
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return viewport
}
