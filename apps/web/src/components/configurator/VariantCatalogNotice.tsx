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
      className="rounded-xl border border-dashed border-primary/25 bg-primary/4 px-3 py-2.5"
      data-testid={`variant-catalog-notice-${optionKey}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Catalogue pending</p>
      <p className="mt-1 text-xs leading-5 text-muted-deep">
        Railhead variant selection and unit pricing are blocked until {summary.owner} confirms the final catalogue.
        Counts are schematic guides only — not workshop maximums — until survey.
      </p>
    </div>
  )
}
