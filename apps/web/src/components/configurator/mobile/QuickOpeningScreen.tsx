'use client'

import { getDimensionLimits } from '@steelyes/gate-engine'
import { Pencil } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { CantileverSiteSpaceNote } from '@/components/configurator/CantileverSiteSpaceNote'
import { DimensionControl } from '@/components/configurator/DimensionControl'
import { DimensionMeaningNote } from '@/components/configurator/DimensionMeaningNote'
import { MeasurementGuide } from '@/components/configurator/MeasurementGuide'
import {
  HEIGHT_DIMENSION_PRESETS,
  MOBILE_QUICK_WIDTH_PRESETS,
  WIDTH_DIMENSION_PRESETS,
  type MobileQuickWidthPreset,
} from '@/lib/configurator/presentation'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function widthPresetsForLimits(min: number, max: number): MobileQuickWidthPreset[] {
  const curated = MOBILE_QUICK_WIDTH_PRESETS.filter((preset) => preset.mm >= min && preset.mm <= max)
  if (curated.length > 0) return [...curated]

  const mid = Math.round((min + max) / 2 / 50) * 50
  const candidates = Array.from(
    new Set([min, clamp(mid, min, max), max].filter((mm) => mm >= min && mm <= max)),
  )
  return candidates.map((mm, index) => ({
    mm,
    label: index === 0 ? 'Minimum opening' : index === candidates.length - 1 ? 'Maximum opening' : 'Typical opening',
    sublabel: `${mm} mm for this gate type`,
  }))
}

/** Quick Path screen 2 — opening: width and height only. Advanced install details stay in the studio. */
export function QuickOpeningScreen() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const limits = getDimensionLimits(config.gateType)

  const widthPresets = useMemo(
    () => widthPresetsForLimits(limits.minWidthMm, limits.maxWidthMm),
    [limits.minWidthMm, limits.maxWidthMm],
  )

  const heightPresets = useMemo(
    () =>
      HEIGHT_DIMENSION_PRESETS.filter(
        (preset) => preset.mm >= limits.minHeightMm && preset.mm <= limits.maxHeightMm,
      ),
    [limits.minHeightMm, limits.maxHeightMm],
  )

  const widthPresetsList = WIDTH_DIMENSION_PRESETS.filter(
    (preset) => preset.mm >= limits.minWidthMm && preset.mm <= limits.maxWidthMm,
  )

  const matchesPreset = widthPresets.some((preset) => preset.mm === config.widthMm)
  const [widthCustom, setWidthCustom] = useState(!matchesPreset)
  const [heightEdit, setHeightEdit] = useState(false)

  // Keep opening dims inside per-type limits when the gate type changes.
  useEffect(() => {
    const nextWidth = clamp(config.widthMm, limits.minWidthMm, limits.maxWidthMm)
    const nextHeight = clamp(config.heightMm, limits.minHeightMm, limits.maxHeightMm)
    if (nextWidth !== config.widthMm || nextHeight !== config.heightMm) {
      patchConfig({ widthMm: nextWidth, heightMm: nextHeight })
    }
  }, [
    config.widthMm,
    config.heightMm,
    limits.minWidthMm,
    limits.maxWidthMm,
    limits.minHeightMm,
    limits.maxHeightMm,
    patchConfig,
  ])

  useEffect(() => {
    setWidthCustom(!widthPresets.some((preset) => preset.mm === config.widthMm))
  }, [config.gateType, config.widthMm, widthPresets])

  return (
    <div className="space-y-6">
      <MeasurementGuide />
      <DimensionMeaningNote gateType={config.gateType} />

      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">Opening width</span>
        <div className="grid grid-cols-1 gap-2">
          {widthPresets.map((preset) => {
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
            label={config.gateType === 'cantilever_sliding' ? 'Clear opening width' : 'Width'}
            value={config.widthMm}
            min={limits.minWidthMm}
            max={limits.maxWidthMm}
            presets={widthPresetsList}
            onChange={(widthMm) => patchConfig({ widthMm })}
          />
        ) : null}

        {config.gateType === 'cantilever_sliding' ? (
          <CantileverSiteSpaceNote clearOpeningMm={config.widthMm} />
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
            min={limits.minHeightMm}
            max={limits.maxHeightMm}
            presets={heightPresets}
            onChange={(heightMm) => patchConfig({ heightMm })}
          />
        ) : null}
      </div>
    </div>
  )
}
