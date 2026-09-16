'use client'

import {
  getExpectedTopRailheadCount,
  listRailheadVariantsForOption,
} from '@steelyes/gate-engine'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { railheadPhotoPath } from '@/lib/configurator/railhead'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

type RailheadModelPickerProps = {
  /** Include the on/off switch (Design / Choose). Refine already has Decoration. */
  showToggle?: boolean
  /** Compact horizontal strip on Choose; full grid on Refine. */
  layout?: 'grid' | 'strip'
}

/**
 * SKU picker for top railheads. Photo appears beside Design (CA-17 — not on pickets).
 */
export function RailheadModelPicker({
  showToggle = false,
  layout = 'grid',
}: RailheadModelPickerProps) {
  const config = useConfiguratorConfig()
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)
  const setOptionVariant = useConfiguratorStore((state) => state.setOptionVariant)

  if (config.style !== 'traditional_victorian') {
    return null
  }

  const selected = config.options.find((option) => option.key === 'top_railheads')
  const enabled = Boolean(selected?.enabled)

  if (!showToggle && !enabled) return null

  const variants = listRailheadVariantsForOption('top_railheads', config)
  const selectedSlug = selected?.variant
  const orderedVariants =
    layout === 'strip' && selectedSlug
      ? [...variants].sort((a, b) => Number(b.slug === selectedSlug) - Number(a.slug === selectedSlug))
      : variants

  const selectVariant = (slug: string) => {
    const quantity = Math.max(1, getExpectedTopRailheadCount(config.widthMm))
    setOptionQty('top_railheads', quantity)
    setOptionVariant('top_railheads', slug)
  }

  return (
    <section className="space-y-4 border border-steel/10 bg-white p-4" data-testid="railhead-chooser">
      {showToggle ? (
        <ConfiguratorSwitch
          checked={enabled}
          onCheckedChange={(checked) => toggleOption('top_railheads', checked)}
          label="Top railheads"
          description="Pick the cap. The catalogue photo appears beside the Design drawing so you can see it clearly. Count is automatic. Not drawn onto the pickets."
          id="quick-top-railheads"
        />
      ) : (
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
            Railhead model
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-deep">
            Pick the SKU. The photo appears beside the Design drawing so you can see the cap.
            Count stays automatic. Not drawn onto the pickets.
          </p>
        </div>
      )}

      {enabled && orderedVariants.length > 0 ? (
        <div
          className={
            layout === 'strip'
              ? 'flex gap-3 overflow-x-auto pb-1'
              : 'grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4'
          }
          role="radiogroup"
          aria-label="Railhead style"
        >
          {orderedVariants.map((variant) => {
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
                  'flex flex-col items-center gap-2 border px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  layout === 'strip' ? 'min-h-[132px] w-[7.5rem] shrink-0' : 'min-h-[120px]',
                  isSelected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-steel/12 bg-paper hover:border-steel/30',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static public railhead photo */}
                <img
                  src={publicPath}
                  alt=""
                  className={cn(
                    'w-full object-contain object-bottom',
                    layout === 'strip' ? 'h-20' : 'h-16',
                  )}
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
      ) : null}
    </section>
  )
}

/** @deprecated Use Decoration on/off in OptionsAccordion + RailheadModelPicker */
export const RailheadChooserSection = RailheadModelPicker
