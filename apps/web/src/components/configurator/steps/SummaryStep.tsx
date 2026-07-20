'use client'

import { ConfiguratorSharePanel } from '@/components/configurator/ConfiguratorSharePanel'

export function SummaryStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-deep">
        Review your configuration and share it with Steelyes for a survey-led quote.
      </p>

      <ConfiguratorSharePanel />

      <div className="border border-dashed border-steel/12 bg-paper px-4 py-4">
        <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
          Ready for review
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-deep">
          Your live preview stays visible in the studio panel. Use Request a quote when you want to proceed to the
          survey-led flow.
        </p>
      </div>
    </div>
  )
}
