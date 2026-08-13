'use client'

import { OptionsAccordion } from '@/components/configurator/OptionsAccordion'
import { RailheadModelPicker } from '@/components/configurator/RailheadChooserSection'

export function RefineActPanel() {
  return (
    <div className="space-y-6">
      <OptionsAccordion />
      {/* Optional SKU picker when railheads are on — Design drawing ignores RH (CA-17). */}
      <RailheadModelPicker />
    </div>
  )
}
