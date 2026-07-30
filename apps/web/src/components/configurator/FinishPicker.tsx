'use client'

import { listFinishDefinitions, type FinishCode } from '@steelyes/gate-engine'

type FinishPickerProps = {
  value: FinishCode
  onChange: (finish: FinishCode) => void
}

export function FinishPicker({ value, onChange }: FinishPickerProps) {
  const finishes = listFinishDefinitions()

  return (
    <div className="space-y-2">
      <span className="block font-mono text-xs uppercase tracking-widest text-muted">Finish</span>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="radiogroup"
        aria-label="Gate finish"
      >
        {finishes.map((finish) => {
          const selected = finish.code === value
          const swatch = finish.schematic.frame

          return (
            <button
              key={finish.code}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(finish.code)}
              className={`flex min-h-[64px] flex-col items-start justify-between border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                selected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-steel/12 bg-white hover:border-primary/25'
              }`}
            >
              <span
                className="h-8 w-full border border-steel/10"
                style={{ backgroundColor: swatch }}
                aria-hidden
              />
              <span className="mt-2 font-body text-sm font-medium text-steel">{finish.label}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs leading-5 text-muted-deep">
        Finish preview is schematic — final powder coat may vary.
        {value === 'other_ral'
          ? ' Custom RAL: + extra charge — powder coating (quoted separately).'
          : ' Colour line totals are confirmed at survey.'}
      </p>
    </div>
  )
}
