'use client'

import { ConfiguratorQuoteRequestForm } from '@/components/configurator/ConfiguratorQuoteRequestForm'
import { EmailMyDesignPanel } from '@/components/configurator/EmailMyDesignPanel'
import {
  SITE_SURVEY_FIELD_LABEL,
  finishLabel,
  formatPricingBarAmount,
  gateTypeLabel,
  postsSummaryLabel,
  styleLabel,
} from '@/lib/configurator/labels'
import { useConfiguratorConfig, useConfiguratorPricing, useConfiguratorStore } from '@/store/configuratorStore'

/** Quick Path screen 3 — quote: compact checklist, site survey, details escape, share. */
export function QuickQuoteScreen() {
  const config = useConfiguratorConfig()
  const pricing = useConfiguratorPricing()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const setFlowMode = useConfiguratorStore((state) => state.setFlowMode)
  const goToAct = useConfiguratorStore((state) => state.goToAct)

  const rows: { label: string; value: string }[] = [
    { label: 'Gate', value: `${gateTypeLabel(config.gateType)} · ${styleLabel(config.style)}` },
    { label: 'Opening', value: `${config.widthMm} × ${config.heightMm} mm` },
    { label: 'Finish', value: finishLabel(config.finish, config.customFinishHex) },
    { label: 'Drive', value: config.motorised ? 'Motorised' : 'Manual only' },
    { label: 'Posts', value: postsSummaryLabel(config) },
    { label: 'Estimated total', value: formatPricingBarAmount(pricing) },
  ]

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-steel/8 border border-steel/10 bg-white">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start justify-between gap-3 px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">{row.label}</span>
            <span className="text-right font-body text-sm font-medium text-steel">{row.value}</span>
          </li>
        ))}
      </ul>

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
            Steelyes attends site to verify measurements and conditions before fabrication.
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={() => {
          setFlowMode('studio')
          goToAct('refine')
        }}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-1 border border-dashed border-steel/15 bg-white px-4 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Add decorative details
      </button>

      <ConfiguratorQuoteRequestForm />

      <EmailMyDesignPanel />
    </div>
  )
}
