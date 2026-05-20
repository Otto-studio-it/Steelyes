'use client'

import { VariantCatalogNotice } from '@/components/configurator/VariantCatalogNotice'
import { OPTION_META } from '@/lib/configurator/constants'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function OptionsStep() {
  const config = useConfiguratorConfig()
  const toggleOption = useConfiguratorStore((state) => state.toggleOption)
  const setOptionQty = useConfiguratorStore((state) => state.setOptionQty)

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#5B514D]">
        Add decorative details one at a time. Railheads stay provisional until their unit prices are confirmed.
      </p>

      {OPTION_META.map((option) => {
        const selected = config.options.find((item) => item.key === option.key)
        const enabled = Boolean(selected?.enabled)
        const quantity = selected?.quantity ?? 0
        const provisionalRailhead = option.key === 'top_railheads' || option.key === 'dog_bar_railheads'

        return (
          <div
            key={option.key}
            className={`rounded-2xl border p-4 transition ${
              enabled ? 'border-[#9E000C]/30 bg-[#9E000C]/4' : 'border-[#1B1C1A]/10 bg-[#F9F7F4]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => toggleOption(option.key, !enabled)}>
                <span className="block font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#5B514D]">{option.description}</span>
              </button>
              <button
                type="button"
                className={`inline-flex min-h-[44px] min-w-[92px] shrink-0 items-center justify-center rounded-full px-4 font-heading text-xs font-bold uppercase tracking-tight transition ${
                  enabled
                    ? 'bg-[#1B1C1A] text-white hover:bg-[#9E000C]'
                    : 'border border-[#1B1C1A]/12 bg-white text-[#1B1C1A] hover:border-[#9E000C]/30 hover:text-[#9E000C]'
                }`}
                onClick={() => toggleOption(option.key, !enabled)}
              >
                {enabled ? 'On' : 'Off'}
              </button>
            </div>

            {enabled && option.quantityLabel ? (
              <div className="mt-4 space-y-3 border-t border-[#1B1C1A]/8 pt-4">
                <label className="block space-y-2">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">
                    {option.quantityLabel}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    step={1}
                    inputMode="numeric"
                    className="h-12 w-full rounded-xl border border-[#1B1C1A]/12 bg-white px-4 font-body text-base text-[#1B1C1A] outline-none transition focus:border-[#9E000C]"
                    value={quantity}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value)
                      if (Number.isNaN(nextQuantity)) return
                      setOptionQty(option.key, Math.max(1, nextQuantity))
                    }}
                  />
                </label>
                <VariantCatalogNotice optionKey={option.key} />
                <p className="text-xs leading-5 text-[#5B514D]">
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
