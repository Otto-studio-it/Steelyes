'use client'

import {
  HEIGHT_DIMENSION_PRESETS,
  MAX_HEIGHT_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MIN_WIDTH_MM,
  WIDTH_DIMENSION_PRESETS,
} from '@/lib/configurator/presentation'
import { DimensionControl } from '@/components/configurator/DimensionControl'
import { MeasurementGuide } from '@/components/configurator/MeasurementGuide'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function DimensionsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)

  return (
    <div className="space-y-4">
      <MeasurementGuide />

      <DimensionControl
        label="Width"
        value={config.widthMm}
        min={MIN_WIDTH_MM}
        max={MAX_WIDTH_MM}
        presets={WIDTH_DIMENSION_PRESETS}
        onChange={(widthMm) => patchConfig({ widthMm })}
      />

      <DimensionControl
        label="Height"
        value={config.heightMm}
        min={MIN_HEIGHT_MM}
        max={MAX_HEIGHT_MM}
        presets={HEIGHT_DIMENSION_PRESETS}
        onChange={(heightMm) => patchConfig({ heightMm })}
      />
    </div>
  )
}
