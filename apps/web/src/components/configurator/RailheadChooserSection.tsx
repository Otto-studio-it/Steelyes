'use client'

import {
  getExpectedTopRailheadCount,
  listRailheadVariantsForOption,
} from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

function railheadPhotoPath(slug: string): string {
  return `/2d-masters/railheads/photos/${slug}.webp`
}

/**
 * SKU picker shown only when Top railheads is ON.
 * Selection is for quote/email/PDF — not drawn on Design 2D (CA-17).
 */
export function RailheadModelPicker() {
  const config = useConfiguratorConfig()
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)
  const setOptionVariant = useConfiguratorStore((state) => state.setOptionVariant)

  if (config.style !== 'traditional_victorian') {
    return null
  }

  const selected = config.options.find((option) => option.key === 'top_railheads')
  const enabled = Boolean(selected?.enabled)
  if (!enabled) return null

  const variants = listRailheadVariantsForOption('top_railheads', config)
  if (variants.length === 0) return null

  const selectedSlug = selected?.variant

  const selectVariant = (slug: string) => {
    const quantity = Math.max(1, getExpectedTopRailheadCount(config.widthMm))
    setOptionQty('top_railheads', quantity)
    setOptionVariant('top_railheads', slug)
  }

  return (
    <section className="space-y-4 border border-steel/10 bg-white p-4" data-testid="railhead-chooser">
      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
          Railhead model
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Optional — pick the SKU. The photo appears beside the Design drawing. Count stays
          automatic. Not drawn onto the pickets.
        </p>
      </div>

      <div
        className="grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4"
        role="radiogroup"
        aria-label="Railhead style"
      >
        {variants.map((variant) => {
          const publicPath = railheadPhotoPath(variant.slug)
          const isSelected = selectedSlug === variant.slug
          const price =
            typeof variant.unitPriceGbp === 'number' && variant.unitPriceGbp > 0
              ? `£${variant.unitPriceGbp.toFixed(2)}`
              : null

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
              {/* eslint-disable-next-line @next/next/no-img-element -- static public railhead photo */}
              <img
                src={publicPath}
                alt=""
                className="h-16 w-full object-contain object-bottom"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-steel">
                {variant.slug}
              </span>
              {price ? (
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {price} ex VAT
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}

/** @deprecated Use Decoration on/off in OptionsAccordion + RailheadModelPicker */
export const RailheadChooserSection = RailheadModelPicker
