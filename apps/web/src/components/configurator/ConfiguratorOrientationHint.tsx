'use client'

import { RotateCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const DISMISS_KEY = 'sy_configurator_orientation_hint_dismissed'

export function ConfiguratorOrientationHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
      setVisible(!dismissed)
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) {
    return null
  }

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Best-effort only.
    }
    setVisible(false)
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-steel/10 bg-paper px-4 py-3">
      <RotateCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-steel">
          <strong className="font-semibold">Tip:</strong> Rotate your device to see the preview and controls side by
          side.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-steel/10 bg-white text-muted transition hover:border-primary/30 hover:text-primary"
        aria-label="Dismiss orientation tip"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
