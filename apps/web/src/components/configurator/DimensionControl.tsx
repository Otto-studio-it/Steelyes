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
    <div className="space-y-3 rounded-2xl border border-[#1B1C1A]/10 bg-[#FCFBF8] p-4">
      <div className="flex items-end justify-between gap-3">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">{label}</span>
        <span className="font-heading text-lg font-black uppercase tracking-tight text-[#1B1C1A]">{value} mm</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E8E4DD] accent-[#9E000C]"
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
                ? 'bg-[#1B1C1A] text-white'
                : 'border border-[#1B1C1A]/12 bg-white text-[#6D615D] hover:border-[#9E000C]/30 hover:text-[#9E000C]'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <label className="block space-y-2 lg:hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">Exact value</span>
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
          className="h-12 w-full rounded-xl border border-[#1B1C1A]/12 bg-white px-4 font-body text-base text-[#1B1C1A] outline-none transition focus:border-[#9E000C]"
        />
      </label>
    </div>
  )
}
