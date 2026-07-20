'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import { DimensionControl } from '@/components/configurator/DimensionControl'
import {
  HEIGHT_DIMENSION_PRESETS,
  MAX_HEIGHT_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MIN_WIDTH_MM,
  MOBILE_QUICK_WIDTH_PRESETS,
  WIDTH_DIMENSION_PRESETS,
} from '@/lib/configurator/presentation'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

/** Quick Path screen 2 — opening: width and height only. Advanced install details stay in the studio. */
export function QuickOpeningScreen() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)

  const matchesPreset = MOBILE_QUICK_WIDTH_PRESETS.some((preset) => preset.mm === config.widthMm)
  const [widthCustom, setWidthCustom] = useState(!matchesPreset)
  const [heightEdit, setHeightEdit] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">Opening width</span>
        <div className="grid grid-cols-1 gap-2">
          {MOBILE_QUICK_WIDTH_PRESETS.map((preset) => {
            const selected = !widthCustom && config.widthMm === preset.mm
            return (
              <button
                key={preset.mm}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setWidthCustom(false)
                  patchConfig({ widthMm: preset.mm })
                }}
                className={`flex min-h-[56px] items-center justify-between gap-3 border px-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected ? 'border-primary bg-primary/5' : 'border-steel/12 bg-white hover:border-primary/30'
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                    {preset.label}
                  </span>
                  <span className="block text-xs text-muted-deep">{preset.sublabel}</span>
                </span>
                <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted tabular-nums">
                  {preset.mm} mm
                </span>
              </button>
            )
          })}

          <button
            type="button"
            aria-pressed={widthCustom}
            onClick={() => setWidthCustom(true)}
            className={`flex min-h-[56px] items-center justify-between gap-3 border px-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              widthCustom ? 'border-primary bg-primary/5' : 'border-steel/12 bg-white hover:border-primary/30'
            }`}
          >
            <span className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Custom width</span>
            <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted tabular-nums">
              {widthCustom ? `${config.widthMm} mm` : 'Set exact'}
            </span>
          </button>
        </div>

        {widthCustom ? (
          <DimensionControl
            label="Width"
            value={config.widthMm}
            min={MIN_WIDTH_MM}
            max={MAX_WIDTH_MM}
            presets={WIDTH_DIMENSION_PRESETS}
            onChange={(widthMm) => patchConfig({ widthMm })}
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 border border-steel/10 bg-paper px-4 py-3">
          <div className="min-w-0">
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">Height</span>
            <span className="font-heading text-lg font-black uppercase tracking-tight text-steel tabular-nums">
              {config.heightMm} mm
            </span>
          </div>
          <button
            type="button"
            aria-expanded={heightEdit}
            onClick={() => setHeightEdit((value) => !value)}
            className="inline-flex min-h-[44px] items-center gap-1 border border-steel/12 bg-white px-3 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            {heightEdit ? 'Done' : 'Change'}
          </button>
        </div>

        {heightEdit ? (
          <DimensionControl
            label="Height"
            value={config.heightMm}
            min={MIN_HEIGHT_MM}
            max={MAX_HEIGHT_MM}
            presets={HEIGHT_DIMENSION_PRESETS}
            onChange={(heightMm) => patchConfig({ heightMm })}
          />
        ) : null}
      </div>
    </div>
  )
}
