'use client'

import { VariantCatalogNotice } from '@/components/configurator/VariantCatalogNotice'
import { OPTION_META } from '@/lib/configurator/constants'
import { SITE_SURVEY_FIELD_LABEL } from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function OptionsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-deep">
        Add decorative details one at a time. Railheads stay provisional until their unit prices are confirmed.
      </p>

      <label className="flex items-start gap-3 rounded-2xl border border-steel/10 bg-paper p-4">
        <input
          type="checkbox"
          checked={config.siteSurveyRequested}
          onChange={(event) => patchConfig({ siteSurveyRequested: event.target.checked })}
          className="mt-1 h-5 w-5 rounded border-steel/20 text-primary focus:ring-primary"
        />
        <span className="min-w-0">
          <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
            {SITE_SURVEY_FIELD_LABEL}
          </span>
          <span className="mt-1 block text-sm leading-6 text-muted-deep">
            Tick this if Steelyes should attend site to verify measurements and conditions before fabrication.
          </span>
        </span>
      </label>

      {OPTION_META.map((option) => {
        const selected = config.options.find((item) => item.key === option.key)
        const enabled = Boolean(selected?.enabled)
        const quantity = selected?.quantity ?? 0
        const provisionalRailhead = option.key === 'top_railheads' || option.key === 'dog_bar_railheads'

        return (
          <div
            key={option.key}
            className={`rounded-2xl border p-4 transition ${
              enabled ? 'border-primary/30 bg-primary/4' : 'border-steel/10 bg-paper'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => toggleOption(option.key, !enabled)}>
                <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-deep">{option.description}</span>
              </button>
              <button
                type="button"
                className={`inline-flex min-h-[44px] min-w-[92px] shrink-0 items-center justify-center rounded-full px-4 font-heading text-xs font-bold uppercase tracking-tight transition ${
                  enabled
                    ? 'bg-steel text-white hover:bg-primary'
                    : 'border border-steel/12 bg-white text-steel hover:border-primary/30 hover:text-primary'
                }`}
                onClick={() => toggleOption(option.key, !enabled)}
              >
                {enabled ? 'On' : 'Off'}
              </button>
            </div>

            {enabled && option.quantityLabel ? (
              <div className="mt-4 space-y-3 border-t border-steel/8 pt-4">
                <label className="block space-y-2">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {option.quantityLabel}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    step={1}
                    inputMode="numeric"
                    className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary"
                    value={quantity}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value)
                      if (Number.isNaN(nextQuantity)) return
                      setOptionQty(option.key, Math.max(1, nextQuantity))
                    }}
                  />
                </label>
                <VariantCatalogNotice optionKey={option.key} />
                <p className="text-xs leading-5 text-muted-deep">
                  {provisionalRailhead ? 'Survey required until the railhead catalogue is confirmed.' : 'Included in the indicative summary.'}
                </p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
