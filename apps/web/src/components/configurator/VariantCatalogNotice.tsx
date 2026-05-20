'use client'

import { isRailheadOptionKey, isVariantCatalogBlocked, railheadCatalogSummary } from '@steelyes/gate-engine'
import type { GateOptionKey } from '@steelyes/gate-engine'

type VariantCatalogNoticeProps = {
  optionKey: GateOptionKey
}

export function VariantCatalogNotice({ optionKey }: VariantCatalogNoticeProps) {
  if (!isRailheadOptionKey(optionKey) || !isVariantCatalogBlocked()) {
    return null
  }

  const summary = railheadCatalogSummary()

  return (
    <div
      className="rounded-xl border border-dashed border-[#9E000C]/25 bg-[#9E000C]/4 px-3 py-2.5"
      data-testid={`variant-catalog-notice-${optionKey}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E000C]">Catalogue pending</p>
      <p className="mt-1 text-xs leading-5 text-[#5B514D]">
        Railhead variant selection and unit pricing are blocked until {summary.owner} confirms the final catalogue.
        Count is schematic only; survey is required for an exact quote.
      </p>
    </div>
  )
}
