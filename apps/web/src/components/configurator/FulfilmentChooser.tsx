'use client'

import { FULFILMENT_MODES, type FulfilmentMode } from '@steelyes/gate-engine'

import { FULFILMENT_FIELD_LABEL, FULFILMENT_OPTION_COPY } from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function FulfilmentChooser() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)

  return (
    <div className="space-y-3">
      <div>
        <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
          {FULFILMENT_FIELD_LABEL}
        </span>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Choose whether Steelyes should fit the gate, or supply it only. This does not change the
          indicative total — installation is quoted after survey.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={FULFILMENT_FIELD_LABEL}>
        {FULFILMENT_MODES.map((mode: FulfilmentMode) => {
          const selected = config.fulfilment === mode
          const copy = FULFILMENT_OPTION_COPY[mode]

          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => patchConfig({ fulfilment: mode })}
              className={`min-h-[52px] border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                selected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-steel/12 bg-white hover:border-primary/30'
              }`}
            >
              <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                {copy.label}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-deep">{copy.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
