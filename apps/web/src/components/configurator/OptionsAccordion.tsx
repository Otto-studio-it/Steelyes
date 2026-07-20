'use client'

import { VariantCatalogNotice } from '@/components/configurator/VariantCatalogNotice'
import { RailheadVariantPicker } from '@/components/configurator/RailheadVariantPicker'
import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { isRailheadOptionKey } from '@steelyes/gate-engine'
import { OPTION_GROUPS, OPTION_META } from '@/lib/configurator/options'
import { SITE_SURVEY_FIELD_LABEL } from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

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

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted-deep">
        Personalise structure, decoration, and site preferences. Each change updates the live preview immediately.
      </p>

      {OPTION_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`option-group-${group.id}`}>
          <div className="mb-3 border-l-4 border-steel/20 pl-4">
            <h3 id={`option-group-${group.id}`} className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
              {group.label}
            </h3>
            <p className="mt-1 text-sm text-muted-deep">{group.description}</p>
          </div>

          <div className="space-y-3">
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
        </section>
      ))}
    </div>
  )
}
