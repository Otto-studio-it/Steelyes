'use client'

import { OptionsAccordion } from '@/components/configurator/OptionsAccordion'
import { RailheadChooserSection } from '@/components/configurator/RailheadChooserSection'

export function RefineActPanel() {
  return (
    <div className="space-y-6">
      <RailheadChooserSection />
      <OptionsAccordion />
    </div>
  )
}
