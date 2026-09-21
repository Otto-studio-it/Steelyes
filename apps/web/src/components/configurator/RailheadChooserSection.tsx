'use client'

import {
  getExpectedTopRailheadCount,
  listRailheadVariantsForOption,
  railheadProductDescription,
  railheadSeriesLabel,
} from '@steelyes/gate-engine'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { SelectedCheck } from '@/components/configurator/SelectedCheck'
import { useScrollSelectedIntoView } from '@/hooks/useScrollSelectedIntoView'
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

  const [allOpen, setAllOpen] = useState(false)
  const selected = config.options.find((option) => option.key === 'top_railheads')
  const enabled = Boolean(selected?.enabled)
  const stripRef = useScrollSelectedIntoView<HTMLDivElement>(enabled ? selected?.variant : null)

  if (config.style !== 'traditional_victorian') {
    return null
  }

  if (!showToggle && !enabled) return null

  const variants = listRailheadVariantsForOption('top_railheads', config)
  const selectedSlug = selected?.variant

  const selectVariant = (slug: string) => {
    const quantity = Math.max(1, getExpectedTopRailheadCount(config.widthMm))
    setOptionQty('top_railheads', quantity)
    setOptionVariant('top_railheads', slug)
  }

  const renderCard = (
    variant: (typeof variants)[number],
    mode: 'grid' | 'strip' | 'sheet',
  ) => {
    const publicPath = railheadPhotoPath(variant.slug)
    const isSelected = selectedSlug === variant.slug
    const copy = railheadProductDescription(variant.slug)
    const series = railheadSeriesLabel(variant.slug)
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
        aria-label={copy.detail}
        data-sku={variant.slug}
        data-series={series}
        onClick={() => {
          selectVariant(variant.slug)
          if (mode === 'sheet') setAllOpen(false)
        }}
        className={cn(
          'relative flex flex-col items-center gap-2 border-2 px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          mode === 'strip'
            ? 'min-h-[176px] w-36 shrink-0 snap-start'
            : mode === 'sheet'
              ? 'min-h-[150px]'
              : 'min-h-[120px]',
          isSelected ? 'border-primary bg-primary/5' : 'border-steel/12 bg-paper hover:border-steel/30',
        )}
      >
        {isSelected ? <SelectedCheck className="right-1.5 top-1.5" /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element -- static public railhead photo */}
        <img
          src={publicPath}
          alt={copy.detail}
          className={cn(
            'w-full object-contain object-bottom',
            mode === 'grid' ? 'h-16' : 'h-28',
          )}
        />
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-steel">
          {series}
        </span>
        {copy.sizeLabel ? (
          <span className="text-xs leading-4 text-muted-deep">{copy.sizeLabel}</span>
        ) : null}
        {price ? (
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {price} ex VAT
          </span>
        ) : null}
      </button>
    )
  }

  return (
    <section className="space-y-4 border border-steel/10 bg-white p-4" data-testid="railhead-chooser">
      {showToggle ? (
        <ConfiguratorSwitch
          checked={enabled}
          onCheckedChange={(checked) => toggleOption('top_railheads', checked)}
          label="Top railheads"
          description="Decorative caps on top of the pickets. Pick a model — we work out how many you need. They appear as a photo beside the drawing, not on it."
          id="quick-top-railheads"
        />
      ) : (
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
            Railhead model
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-deep">
            Photos show the railhead on its own. We work out how many you need. They appear beside
            the drawing, not on it.
          </p>
        </div>
      )}

      {enabled && variants.length > 0 ? (
        <>
          {/* Order never changes on select — the chosen card is scrolled into view instead. */}
          <div
            ref={layout === 'strip' ? stripRef : undefined}
            className={
              layout === 'strip'
                ? 'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                : 'grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4'
            }
            role="radiogroup"
            aria-label="Railhead style"
          >
            {variants.map((variant) => renderCard(variant, layout))}
          </div>

          {layout === 'strip' && variants.length > 3 ? (
            <button
              type="button"
              onClick={() => setAllOpen(true)}
              className="inline-flex min-h-[44px] w-full items-center justify-center border border-steel/12 bg-white px-4 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              See all {variants.length} models
            </button>
          ) : null}

          <Dialog.Root open={allOpen} onOpenChange={setAllOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="cfg-sheet-overlay fixed inset-0 z-50 bg-steel/60 backdrop-blur-sm" />
              <Dialog.Content
                className="cfg-sheet-content fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col border-t border-steel/10 bg-canvas focus:outline-none"
                style={{ overscrollBehavior: 'contain', paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-steel/10 px-4 py-3">
                  <Dialog.Title className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                    Choose railhead
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-steel/15 text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Close railhead chooser"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
                <div
                  className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4"
                  style={{ overscrollBehavior: 'contain' }}
                  role="radiogroup"
                  aria-label="All railhead styles"
                >
                  {variants.map((variant) => renderCard(variant, 'sheet'))}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      ) : null}
    </section>
  )
}

/** @deprecated Use Decoration on/off in OptionsAccordion + RailheadModelPicker */
export const RailheadChooserSection = RailheadModelPicker
