'use client'

import { RefreshCcw } from 'lucide-react'

import { QuickGateScreen } from '@/components/configurator/mobile/QuickGateScreen'
import { useConfiguratorStore } from '@/store/configuratorStore'

/**
 * ponytail: desktop Choose reuses Quick Path progressive disclosure
 * (primary hero + “Change” sheet) instead of dumping all 8 types.
 */
export function ChooseActPanel() {
  const resetToPrimarySlice = useConfiguratorStore((state) => state.resetToPrimarySlice)

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted-deep">
        Start from double swing — the primary production path — then change mechanism only if your opening needs
        it. Style, finish and motor update the live preview immediately.
      </p>

      <QuickGateScreen />

      <div className="flex items-center justify-between gap-3 border border-dashed border-steel/12 bg-paper px-4 py-3">
        <p className="text-sm text-muted-deep">Reset to the default double swing starting point.</p>
        <button
          type="button"
          onClick={resetToPrimarySlice}
          className="inline-flex min-h-[44px] items-center gap-2 border border-steel/10 bg-white px-4 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
