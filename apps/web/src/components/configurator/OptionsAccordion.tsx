'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { PriceDeltaChip } from '@/components/configurator/PriceDeltaChip'
import { OPTION_GROUPS, OPTION_META, type OptionGroupId } from '@/lib/configurator/options'
import { SITE_SURVEY_FIELD_LABEL } from '@/lib/configurator/labels'
import { estimateOptionEnableDelta, formatPriceDelta } from '@/lib/configurator/price-delta'
import { COMPOSITE_DISABLED_OPTION_KEYS } from '@/lib/configurator/style-actions'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

function OptionRow({ optionKey }: { optionKey: (typeof OPTION_META)[number]['key'] }) {
  const config = useConfiguratorConfig()
  const pricingCatalog = useConfiguratorStore((state) => state.pricingCatalog)
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)
  const option = OPTION_META.find((item) => item.key === optionKey)
  if (!option) return null
  if (option.key === 'aluminium_panels' && config.style !== 'composite_boards') {
    return null
  }
  if (option.key === 'bushes' || option.key === 'spirals') {
    // Legacy inserts — superseded by Circles / Collar for Victorian Design masters
    return null
  }

  const isCompositeBlocked =
    config.style === 'composite_boards' && COMPOSITE_DISABLED_OPTION_KEYS.includes(option.key)

  const selected = config.options.find((item) => item.key === option.key)
  const enabled = Boolean(selected?.enabled) && !isCompositeBlocked
  const quantity = selected?.quantity ?? 0
  const enableDelta = estimateOptionEnableDelta(config, pricingCatalog, option.key)
  const deltaLabel = formatPriceDelta(enableDelta.deltaGbp)

  // Quantity UI only for legacy countable inserts — never for dog bars / circles / collars / railheads.
  const showQuantity =
    enabled &&
    Boolean(option.quantityLabel) &&
    option.key !== 'dog_bars' &&
    option.key !== 'circles' &&
    option.key !== 'picket_collars' &&
    option.key !== 'top_railheads'

  return (
    <div
      className={`border p-4 transition ${
        isCompositeBlocked
          ? 'border-steel/8 bg-paper/60 opacity-60'
          : enabled
            ? 'border-primary/30 bg-primary/5'
            : 'border-steel/10 bg-paper'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <ConfiguratorSwitch
            checked={enabled}
            onCheckedChange={(checked) => toggleOption(option.key, checked)}
            label={option.label}
            description={
              isCompositeBlocked
                ? 'Not available on Composite Boards — only Victorian tipologies include this decoration.'
                : option.description
            }
            id={`option-${option.key}`}
            disabled={isCompositeBlocked}
          />
        </div>
        {!isCompositeBlocked && deltaLabel ? (
          <PriceDeltaChip label={deltaLabel} tone="hint" className="mt-1 shrink-0" />
        ) : null}
      </div>

      {showQuantity ? (
        <div className="mt-4 space-y-3 border-t border-steel/8 pt-4">
          <label className="block space-y-2">
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">
              {option.quantityLabel}
            </span>
            <input
              type="number"
              min={1}
              max={24}
              step={1}
              inputMode="numeric"
              className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              value={quantity}
              onChange={(event) => {
                const nextQuantity = Number(event.target.value)
                if (Number.isNaN(nextQuantity)) return
                setOptionQty(option.key, Math.max(1, nextQuantity))
              }}
            />
          </label>
          <p className="text-xs leading-5 text-muted-deep">Included in the estimated total.</p>
        </div>
      ) : null}
    </div>
  )
}

export function OptionsAccordion() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  // ponytail: one group open — Structure first
  const [openGroupId, setOpenGroupId] = useState<OptionGroupId>('structure')

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-deep">
        Personalise structure, decoration, and site preferences. Open one group at a time.
        Shape, circles and collars update the Design drawing. Railheads and middle bar are quote
        fields — they do not redraw the master.
      </p>

      {OPTION_GROUPS.map((group) => {
        const open = openGroupId === group.id

        return (
          <section key={group.id} className="border border-steel/10 bg-white">
            <h3>
              <button
                type="button"
                id={`option-group-${group.id}`}
                aria-expanded={open}
                aria-controls={`option-group-panel-${group.id}`}
                onClick={() => setOpenGroupId(group.id)}
                className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <span>
                  <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                    {group.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-deep">{group.description}</span>
                </span>
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180')}
                  aria-hidden
                />
              </button>
            </h3>

            {open ? (
              <div
                id={`option-group-panel-${group.id}`}
                role="region"
                aria-labelledby={`option-group-${group.id}`}
                className="space-y-3 border-t border-steel/10 px-4 py-4"
              >
                {group.id === 'site' ? (
                  <label className="flex items-start gap-3 border border-steel/10 bg-paper p-4">
                    <input
                      type="checkbox"
                      checked={config.siteSurveyRequested}
                      onChange={(event) => patchConfig({ siteSurveyRequested: event.target.checked })}
                      className="mt-1 h-5 w-5 border-steel/20 text-primary focus:ring-primary"
                    />
                    <span className="min-w-0">
                      <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                        {SITE_SURVEY_FIELD_LABEL}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-deep">
                        Steelyes will attend site to verify measurements and conditions before fabrication.
                      </span>
                    </span>
                  </label>
                ) : (
                  group.keys.map((key) => <OptionRow key={key} optionKey={key} />)
                )}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
