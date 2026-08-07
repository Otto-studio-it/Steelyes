'use client'

import {
  getExpectedTopRailheadCount,
  listRailheadVariantsForOption,
  SILHOUETTE_INDEX,
} from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

/**
 * Catalogue chooser for top railhead SKUs.
 * Selection is stored on GateConfig for quote/email/PDF — not drawn on Design 2D or 3D mesh.
 */
export function RailheadChooserSection() {
  const config = useConfiguratorConfig()
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)
  const setOptionVariant = useConfiguratorStore((state) => state.setOptionVariant)

  const variants = listRailheadVariantsForOption('top_railheads', config)
  const selected = config.options.find((option) => option.key === 'top_railheads')
  const enabled = Boolean(selected?.enabled)
  const selectedSlug = enabled ? selected?.variant : undefined

  const selectVariant = (slug: string) => {
    const guideCount = getExpectedTopRailheadCount(config.widthMm)
    const quantity =
      selected?.quantity && selected.quantity > 0 ? selected.quantity : Math.max(1, guideCount)
    setOptionQty('top_railheads', quantity)
    setOptionVariant('top_railheads', slug)
  }

  const selectNone = () => {
    toggleOption('top_railheads', false)
    setOptionVariant('top_railheads', undefined)
  }

  if (variants.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 border border-steel/10 bg-white p-4" data-testid="railhead-chooser">
      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
          Choose your railheads
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Provisional catalogue — counts confirmed after survey. Not shown on the Design drawing.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Railhead style"
      >
        <button
          type="button"
          role="radio"
          aria-checked={!enabled}
          onClick={selectNone}
          className={cn(
            'flex min-h-[120px] flex-col items-center justify-center gap-2 border px-3 py-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            !enabled
              ? 'border-primary/40 bg-primary/5'
              : 'border-steel/12 bg-paper hover:border-steel/30',
          )}
        >
          <span className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
            None
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Skip</span>
        </button>

        {variants.map((variant) => {
          const silhouette = SILHOUETTE_INDEX.railheads?.silhouettes[variant.slug]
          const publicPath =
            silhouette?.publicPath ?? `/2d-masters/railheads/silhouettes/${variant.slug}.svg`
          const isSelected = selectedSlug === variant.slug

          return (
            <button
              key={variant.slug}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectVariant(variant.slug)}
              className={cn(
                'flex min-h-[120px] flex-col items-center gap-2 border px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-steel/12 bg-paper hover:border-steel/30',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static public railhead silhouette */}
              <img
                src={publicPath}
                alt=""
                className="h-14 w-full object-contain object-bottom"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-steel">
                {variant.slug}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
