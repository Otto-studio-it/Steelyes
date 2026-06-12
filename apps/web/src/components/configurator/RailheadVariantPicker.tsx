'use client'

import {
  isRailheadOptionKey,
  listRailheadVariantsForOption,
  type GateOptionKey,
} from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

type RailheadVariantPickerProps = {
  optionKey: GateOptionKey
}

export function RailheadVariantPicker({ optionKey }: RailheadVariantPickerProps) {
  const config = useConfiguratorConfig()
  const setOptionVariant = useConfiguratorStore((state) => state.setOptionVariant)

  if (!isRailheadOptionKey(optionKey)) {
    return null
  }

  const variants = listRailheadVariantsForOption(optionKey, config)
  if (variants.length === 0) {
    return null
  }

  const selected = config.options.find((option) => option.key === optionKey)
  const value = selected?.variant ?? ''

  return (
    <label className="block space-y-2">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Railhead style</span>
      <select
        className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
        value={value}
        onChange={(event) => setOptionVariant(optionKey, event.target.value || undefined)}
      >
        <option value="">Select a style (provisional)</option>
        {variants.map((variant) => (
          <option key={variant.slug} value={variant.slug}>
            {variant.label}
            {variant.unitPriceGbp !== null ? ` — from £${variant.unitPriceGbp}` : ''}
          </option>
        ))}
      </select>
      <p className="text-xs leading-5 text-muted-deep">
        Provisional catalogue — final SKU and unit price confirmed after survey.
      </p>
    </label>
  )
}
