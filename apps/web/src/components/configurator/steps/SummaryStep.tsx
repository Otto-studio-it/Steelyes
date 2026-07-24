'use client'

import { ConfigurationSummary } from '@/components/configurator/ConfigurationSummary'
import { ConfiguratorQuoteRequestForm } from '@/components/configurator/ConfiguratorQuoteRequestForm'
import { EmailMyDesignPanel } from '@/components/configurator/EmailMyDesignPanel'
import { useConfiguratorConfig, useConfiguratorPricing } from '@/store/configuratorStore'

export function SummaryStep() {
  const config = useConfiguratorConfig()
  const pricing = useConfiguratorPricing()

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-deep">
        Review your configuration, then leave your details for a survey-led quote.
      </p>

      <div className="border border-steel/10 bg-paper px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Your configuration</p>
        <ConfigurationSummary config={config} pricing={pricing} />
      </div>

      <ConfiguratorQuoteRequestForm />

      <EmailMyDesignPanel />
    </div>
  )
}
