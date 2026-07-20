'use client'

import { useEffect, useState } from 'react'

export type ConfiguratorViewportMode = 'portrait-phone' | 'landscape-phone' | 'tablet' | 'desktop'

export type ConfiguratorViewport = {
  mode: ConfiguratorViewportMode
  isPortraitPhone: boolean
  isLandscapePhone: boolean
  /** Phones (portrait or landscape) — the Quick Path default surface. Excludes tablet. */
  isMobileQuickEligible: boolean
}

const DESKTOP_QUERY = '(min-width: 1024px)'
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)'
const LANDSCAPE_PHONE_QUERY = '(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)'

function resolveViewport(): ConfiguratorViewport {
  if (typeof window === 'undefined') {
    return {
      mode: 'desktop',
      isPortraitPhone: false,
      isLandscapePhone: false,
      isMobileQuickEligible: false,
    }
  }

  if (window.matchMedia(DESKTOP_QUERY).matches) {
    return {
      mode: 'desktop',
      isPortraitPhone: false,
      isLandscapePhone: false,
      isMobileQuickEligible: false,
    }
  }

  if (window.matchMedia(LANDSCAPE_PHONE_QUERY).matches) {
    return {
      mode: 'landscape-phone',
      isPortraitPhone: false,
      isLandscapePhone: true,
      isMobileQuickEligible: true,
    }
  }

  if (window.matchMedia(TABLET_QUERY).matches) {
    return {
      mode: 'tablet',
      isPortraitPhone: false,
      isLandscapePhone: false,
      isMobileQuickEligible: false,
    }
  }

  return {
    mode: 'portrait-phone',
    isPortraitPhone: true,
    isLandscapePhone: false,
    isMobileQuickEligible: true,
  }
}

export function useConfiguratorViewport(): ConfiguratorViewport {
  const [viewport, setViewport] = useState<ConfiguratorViewport>(() => resolveViewport())

  useEffect(() => {
    const update = () => setViewport(resolveViewport())
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
