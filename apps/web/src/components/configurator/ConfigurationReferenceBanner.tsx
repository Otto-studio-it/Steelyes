import {
  finishLabel,
  formatPricingHeadline,
  gateTypeLabel,
  styleLabel,
} from '@/lib/configurator/labels'
import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import type { GateConfig } from '@steelyes/gate-engine'
import { calculateIndicativeGatePrice } from '@steelyes/gate-engine'

type ConfigurationReferenceBannerProps = {
  config: GateConfig
  shareToken: string
}

export function ConfigurationReferenceBanner({ config, shareToken }: ConfigurationReferenceBannerProps) {
  const pricing = calculateIndicativeGatePrice(config)

  return (
    <div className="mb-6 border border-[#9E000C]/20 bg-[#9E000C]/5 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9E000C]">Attached configuration</p>
      <h2 className="mt-2 font-heading text-xl font-black uppercase tracking-tight text-[#1B1C1A]">
        {gateTypeLabel(config.gateType)} · {styleLabel(config.style)}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#5C403D]">
        {config.widthMm} × {config.heightMm} mm · {finishLabel(config.finish)} · {config.motorised ? 'Motorised' : 'Manual'} ·{' '}
        {formatPricingHeadline(pricing)} {pricing.totalLabel}
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#5C403D]">
        Reference: {buildQuoteSharePath(shareToken)}
      </p>
    </div>
  )
}
