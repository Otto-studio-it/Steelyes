'use client'

import { CollarChooserSection } from '@/components/configurator/CollarChooserSection'
import { OptionsAccordion } from '@/components/configurator/OptionsAccordion'
import { RailheadModelPicker } from '@/components/configurator/RailheadChooserSection'
import { TipologyPicker } from '@/components/configurator/TipologyPicker'

export function RefineActPanel() {
  return (
    <div className="space-y-6">
      <TipologyPicker />
      <OptionsAccordion />
      <CollarChooserSection />
      {/* SKU picker when railheads are on — photo sits beside Design, not on pickets. */}
      <RailheadModelPicker />
    </div>
  )
}
