import {
  formatConfigurationSummaryInline,
} from '@/lib/configurator/configuration-summary'
import {
  formatPricingHeadline,
  gateTypeLabel,
  styleLabel,
} from '@/lib/configurator/labels'
import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import type { GateConfig, PricingCatalog } from '@steelyes/gate-engine'
import { DEFAULT_PRICING_CATALOG, calculateIndicativeGatePrice } from '@steelyes/gate-engine'

type ConfigurationReferenceBannerProps = {
  config: GateConfig
  shareToken: string
  pricingCatalog?: PricingCatalog
}

export function ConfigurationReferenceBanner({
  config,
  shareToken,
  pricingCatalog = DEFAULT_PRICING_CATALOG,
}: ConfigurationReferenceBannerProps) {
  const pricing = calculateIndicativeGatePrice(config, pricingCatalog)

  return (
    <div className="mb-6 border border-primary/20 bg-primary/5 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Attached configuration</p>
      <h2 className="mt-2 font-heading text-xl font-black uppercase tracking-tight text-steel">
        {gateTypeLabel(config.gateType)} · {styleLabel(config.style)}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-deep">
        {formatConfigurationSummaryInline(config)} · {formatPricingHeadline(pricing)} {pricing.totalLabel}
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-deep">
        Reference: {buildQuoteSharePath(shareToken)}
      </p>
    </div>
  )
}
