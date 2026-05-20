'use client'

import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { ConfiguratorSharePanel } from '@/components/configurator/ConfiguratorSharePanel'

export function SummaryStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#5B514D] lg:hidden">
        Review your configuration, indicative pricing, and next step before requesting a survey-led quote.
      </p>

      <ConfiguratorSharePanel />

      <div className="lg:hidden">
        <ConfiguratorPriceSummary showActions={false} />
      </div>

      <div className="hidden rounded-2xl border border-dashed border-[#1B1C1A]/12 bg-[#F9F7F4] px-4 py-4 lg:block">
        <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">
          Ready for review
        </p>
        <p className="mt-2 text-sm leading-6 text-[#5B514D]">
          Your live preview and full indicative breakdown stay visible in the panel on the right. Use Request a quote
          when you want to proceed to the survey-led flow.
        </p>
      </div>
    </div>
  )
}
