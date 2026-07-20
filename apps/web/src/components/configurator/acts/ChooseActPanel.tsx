'use client'

import { GateTypeCardGrid } from '@/components/configurator/GateTypeCardGrid'
import { StyleComparisonPicker } from '@/components/configurator/StyleComparisonPicker'
import { FinishPicker } from '@/components/configurator/FinishPicker'
import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { RefreshCcw } from 'lucide-react'

import { isPrimarySlice, useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function ChooseActPanel() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const resetToPrimarySlice = useConfiguratorStore((state) => state.resetToPrimarySlice)
  const primarySlice = isPrimarySlice(config)

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted-deep">
        Select the gate mechanism and style that matches your opening. Double swing is the primary production path
        with full preview fidelity.
      </p>

      <GateTypeCardGrid />

      {!primarySlice ? (
        <p className="border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-deep">
          You are exploring a schematic path. Visual detail and pricing may differ from the primary double swing
          reference.
        </p>
      ) : null}

      <StyleComparisonPicker />

      <FinishPicker
        value={config.finish}
        onChange={(finish) => {
          patchConfig({ finish })
        }}
      />

      <div className="border border-steel/10 bg-paper p-4">
        <ConfiguratorSwitch
          checked={config.motorised}
          onCheckedChange={(motorised) => patchConfig({ motorised })}
          label={config.motorised ? 'Motorised' : 'Manual only'}
          description="Automated opening with compatible motor kit — final specification confirmed at survey."
          id="motorised-toggle"
        />
      </div>

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
