'use client'

import {
  MAX_HEIGHT_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MIN_WIDTH_MM,
  HEIGHT_DIMENSION_PRESETS,
  WIDTH_DIMENSION_PRESETS,
  type DimensionPreset,
} from '@/lib/configurator/presentation'

type DimensionControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  presets: readonly DimensionPreset[]
  onChange: (value: number) => void
}

export function DimensionControl({
  label,
  value,
  min,
  max,
  step = 10,
  presets,
  onChange,
}: DimensionControlProps) {
  return (
    <div className="space-y-3 border border-steel/10 bg-paper p-4">
      <div className="flex items-end justify-between gap-3">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">{label}</span>
        <span className="font-heading text-lg font-black uppercase tracking-tight text-steel">{value} mm</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none bg-steel/15 accent-primary"
        aria-label={label}
      />

      <div className="flex flex-col gap-2">
        {presets.map((preset) => (
          <button
            key={preset.mm}
            type="button"
            onClick={() => onChange(preset.mm)}
            className={`flex min-h-[44px] w-full items-center justify-between gap-3 border px-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              value === preset.mm
                ? 'border-primary bg-primary/5 text-steel'
                : 'border-steel/12 bg-white text-muted hover:border-primary/30 hover:text-primary'
            }`}
          >
            <span className="font-body text-sm">{preset.label}</span>
            <span className="font-mono text-xs uppercase tracking-widest">{preset.mm} mm</span>
          </button>
        ))}
      </div>

      <label className="block space-y-2 lg:hidden">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Exact value</span>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          inputMode="numeric"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (!Number.isNaN(next)) onChange(next)
          }}
          className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>
    </div>
  )
}

export { MIN_WIDTH_MM, MAX_WIDTH_MM, MIN_HEIGHT_MM, MAX_HEIGHT_MM, WIDTH_DIMENSION_PRESETS, HEIGHT_DIMENSION_PRESETS }
