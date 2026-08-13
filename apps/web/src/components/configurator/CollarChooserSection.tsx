'use client'

import { COLLAR_SPACING_VARIANTS, type CollarSpacingVariant } from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

const LABELS: Record<CollarSpacingVariant, { title: string; hint: string }> = {
  every_1: { title: 'Every picket', hint: 'Collar on each long bar' },
  every_2: { title: 'Every 2nd', hint: 'Collar on alternate long bars' },
}

/**
 * Q2–Q4: collar/boss spacing on long pickets only (mid-height). Never on dog bars.
 */
export function CollarChooserSection() {
  const config = useConfiguratorConfig()
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionVariant = useConfiguratorStore((state) => state.setOptionVariant)

  if (config.style !== 'traditional_victorian') {
    return null
  }

  const selected = config.options.find((option) => option.key === 'picket_collars')
  const enabled = Boolean(selected?.enabled)
  const spacing: CollarSpacingVariant =
    selected?.variant === 'every_2' ? 'every_2' : 'every_1'

  const selectNone = () => {
    toggleOption('picket_collars', false)
    setOptionVariant('picket_collars', undefined)
  }

  const selectSpacing = (next: CollarSpacingVariant) => {
    toggleOption('picket_collars', true)
    setOptionVariant('picket_collars', next)
  }

  return (
    <section className="space-y-4 border border-steel/10 bg-white p-4" data-testid="collar-chooser">
      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
          Picket collars
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Decorative boss at mid-height on long pickets only — never on dog bars.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Collar spacing">
        <button
          type="button"
          role="radio"
          aria-checked={!enabled}
          onClick={selectNone}
          className={cn(
            'flex min-h-[88px] flex-col items-center justify-center gap-1 border px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            !enabled
              ? 'border-primary/40 bg-primary/5'
              : 'border-steel/12 bg-paper hover:border-steel/30',
          )}
        >
          <span className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
            None
          </span>
        </button>

        {COLLAR_SPACING_VARIANTS.map((key) => {
          const isSelected = enabled && spacing === key
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectSpacing(key)}
              className={cn(
                'flex min-h-[88px] flex-col items-center justify-center gap-1 border px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-steel/12 bg-paper hover:border-steel/30',
              )}
            >
              <span className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                {LABELS[key].title}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {LABELS[key].hint}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
