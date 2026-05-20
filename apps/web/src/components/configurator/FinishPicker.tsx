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
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">Finish</span>
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
              className={`flex min-h-[52px] flex-col items-start justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                selected
                  ? 'border-[#9E000C] bg-[#FFF8F8] shadow-[0_0_0_1px_rgba(158,0,12,0.15)]'
                  : 'border-[#1B1C1A]/12 bg-white hover:border-[#9E000C]/25'
              }`}
            >
              <span
                className="h-6 w-full rounded-md border border-[#1B1C1A]/10 shadow-inner"
                style={{ backgroundColor: swatch }}
                aria-hidden
              />
              <span className="mt-2 font-body text-sm font-medium text-[#1B1C1A]">{finish.label}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs leading-5 text-[#5B514D]">
        Finish preview is schematic — final powder coat may vary.
      </p>
    </div>
  )
}
