'use client'

import {
  HEIGHT_PRESETS_MM,
  MAX_HEIGHT_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MIN_WIDTH_MM,
  WIDTH_PRESETS_MM,
} from '@/lib/configurator/constants'
import { DimensionControl } from '@/components/configurator/DimensionControl'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function DimensionsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-[#5B514D]">
        Use the sliders or quick presets to set width and height. The preview and indicative price update immediately.
      </p>

      <DimensionControl
        label="Width"
        value={config.widthMm}
        min={MIN_WIDTH_MM}
        max={MAX_WIDTH_MM}
        presets={WIDTH_PRESETS_MM}
        onChange={(widthMm) => patchConfig({ widthMm })}
      />

      <DimensionControl
        label="Height"
        value={config.heightMm}
        min={MIN_HEIGHT_MM}
        max={MAX_HEIGHT_MM}
        presets={HEIGHT_PRESETS_MM}
        onChange={(heightMm) => patchConfig({ heightMm })}
      />
    </div>
  )
}
