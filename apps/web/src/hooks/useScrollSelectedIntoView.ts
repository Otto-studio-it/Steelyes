'use client'

import { useEffect, useRef } from 'react'

/**
 * Keeps the chosen card visible inside a horizontal snap strip without touching the page's
 * vertical scroll. Cards mark themselves with aria-checked="true".
 */
export function useScrollSelectedIntoView<T extends HTMLElement>(selectedKey: string | null | undefined) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    const selected = container?.querySelector<HTMLElement>('[aria-checked="true"]')
    if (!container || !selected || container.scrollWidth <= container.clientWidth) return

    // offsetLeft is relative to the offsetParent, which is usually not the strip itself.
    const left = selected.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft
    const target = left - (container.clientWidth - selected.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [selectedKey])

  return containerRef
}
