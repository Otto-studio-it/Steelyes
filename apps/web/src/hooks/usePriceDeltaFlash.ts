'use client'

import { useEffect, useRef, useState } from 'react'

import { formatPriceDelta } from '@/lib/configurator/price-delta'

const FLASH_MS = 2500

/**
 * ponytail: watch indicative total and flash a signed delta chip when it changes.
 */
export function usePriceDeltaFlash(totalGbp: number | null): string | null {
  const previousTotal = useRef<number | null>(totalGbp)
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    const before = previousTotal.current
    previousTotal.current = totalGbp

    if (before === null || totalGbp === null || before === totalGbp) {
      return
    }

    const label = formatPriceDelta(totalGbp - before)
    if (!label) return

    setFlash(label)
    const timer = window.setTimeout(() => setFlash(null), FLASH_MS)
    return () => window.clearTimeout(timer)
  }, [totalGbp])

  return flash
}
