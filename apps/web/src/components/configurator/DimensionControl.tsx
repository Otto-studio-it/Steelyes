'use client'

type DimensionControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  presets: readonly number[]
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
    <div className="space-y-3 rounded-2xl border border-steel/10 bg-paper p-4">
      <div className="flex items-end justify-between gap-3">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</span>
        <span className="font-heading text-lg font-black uppercase tracking-tight text-steel">{value} mm</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-steel/15 accent-primary"
        aria-label={label}
      />

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-3 font-mono text-[11px] uppercase tracking-widest transition ${
              value === preset
                ? 'bg-steel text-white'
                : 'border border-steel/12 bg-white text-muted hover:border-primary/30 hover:text-primary'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <label className="block space-y-2 lg:hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Exact value</span>
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
          className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary"
        />
      </label>
    </div>
  )
}
