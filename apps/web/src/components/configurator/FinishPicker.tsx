'use client'

import {
  listFinishDefinitions,
  normalizeFinishHex,
  type FinishCode,
} from '@steelyes/gate-engine'
import { useEffect, useId, useState } from 'react'

type FinishPickerProps = {
  value: FinishCode
  customHex?: string | null
  onChange: (finish: FinishCode) => void
  onCustomHexChange?: (hex: string | null) => void
}

export function FinishPicker({
  value,
  customHex = null,
  onChange,
  onCustomHexChange,
}: FinishPickerProps) {
  const finishes = listFinishDefinitions()
  const hexFieldId = useId()
  const [hexDraft, setHexDraft] = useState(customHex ?? '')

  useEffect(() => {
    setHexDraft(customHex ?? '')
  }, [customHex])

  const normalized = normalizeFinishHex(hexDraft)
  const hexInvalid = hexDraft.trim().length > 0 && !normalized

  return (
    <div className="space-y-3">
      <span className="block font-mono text-xs uppercase tracking-widest text-muted">Finish</span>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
        role="radiogroup"
        aria-label="Gate finish"
      >
        {finishes.map((finish) => {
          const selected = finish.code === value
          const swatch =
            finish.code === 'other_ral' && normalized ? normalized : finish.schematic.frame

          return (
            <button
              key={finish.code}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                onChange(finish.code)
                if (finish.code !== 'other_ral') {
                  onCustomHexChange?.(null)
                  setHexDraft('')
                }
              }}
              className={`flex min-h-[64px] flex-col items-start justify-between border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/40 focus-visible:ring-offset-2 ${
                selected
                  ? 'border-steel bg-paper ring-1 ring-steel/25'
                  : 'border-steel/12 bg-white hover:border-steel/35'
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

      {value === 'other_ral' ? (
        <div className="space-y-2 border border-steel/10 bg-paper px-3 py-3">
          <label htmlFor={hexFieldId} className="block font-mono text-xs uppercase tracking-widest text-muted">
            Custom colour (hex)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Pick custom colour"
              value={normalized ?? '#9A9EA3'}
              onChange={(event) => {
                const next = event.target.value.toUpperCase()
                setHexDraft(next)
                onCustomHexChange?.(next)
              }}
              className="h-11 w-12 cursor-pointer border border-steel/15 bg-white p-1"
            />
            <input
              id={hexFieldId}
              type="text"
              inputMode="text"
              spellCheck={false}
              placeholder="#9E000C"
              value={hexDraft}
              onChange={(event) => {
                const next = event.target.value
                setHexDraft(next)
                const parsed = normalizeFinishHex(next)
                onCustomHexChange?.(parsed)
              }}
              className={`min-h-[44px] flex-1 border bg-white px-3 font-mono text-sm text-steel outline-none focus-visible:ring-2 focus-visible:ring-steel/40 ${
                hexInvalid ? 'border-primary/50' : 'border-steel/15'
              }`}
            />
          </div>
          <p className="text-xs leading-5 text-muted-deep">
            {hexInvalid
              ? 'Enter a full hex code such as #9E000C.'
              : '+ extra charge — powder coating (quoted separately). The swatch on Design updates; the CAD master stays line-art.'}
          </p>
        </div>
      ) : (
        <p className="text-xs leading-5 text-muted-deep">
          Client palette: black satin / matt / gloss, anthracite RAL 7016, or a custom hex. The
          Design master stays line-art; the colour swatch on the drawing header tracks your choice.
          Final powder coat is confirmed at survey.
        </p>
      )}
    </div>
  )
}
