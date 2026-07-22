'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { VariantCatalogNotice } from '@/components/configurator/VariantCatalogNotice'
import { RailheadVariantPicker } from '@/components/configurator/RailheadVariantPicker'
import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { isRailheadOptionKey } from '@steelyes/gate-engine'
import { OPTION_GROUPS, OPTION_META, type OptionGroupId } from '@/lib/configurator/options'
import { SITE_SURVEY_FIELD_LABEL } from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'
import { cn } from '@/lib/utils'

function OptionRow({ optionKey }: { optionKey: (typeof OPTION_META)[number]['key'] }) {
  const config = useConfiguratorConfig()
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)
  const option = OPTION_META.find((item) => item.key === optionKey)
  if (!option) return null

  const selected = config.options.find((item) => item.key === option.key)
  const enabled = Boolean(selected?.enabled)
  const quantity = selected?.quantity ?? 0
  const provisionalRailhead = option.key === 'top_railheads' || option.key === 'dog_bar_railheads'

  return (
    <div
      className={`border p-4 transition ${
        enabled ? 'border-primary/30 bg-primary/5' : 'border-steel/10 bg-paper'
      }`}
    >
      <ConfiguratorSwitch
        checked={enabled}
        onCheckedChange={(checked) => toggleOption(option.key, checked)}
        label={option.label}
        description={option.description}
        id={`option-${option.key}`}
      />

      {enabled && option.quantityLabel ? (
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
          {isRailheadOptionKey(option.key) ? <RailheadVariantPicker optionKey={option.key} /> : null}
          <VariantCatalogNotice optionKey={option.key} />
          <p className="text-xs leading-5 text-muted-deep">
            {provisionalRailhead
              ? 'Price confirmed at site survey — does not block your configuration.'
              : 'Included in the indicative summary.'}
          </p>
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
        Personalise structure, decoration, and site preferences. Open one group at a time — each change updates the
        live preview.
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
