'use client'

import { getDimensionLimits } from '@steelyes/gate-engine'

import {
  HEIGHT_DIMENSION_PRESETS,
  WIDTH_DIMENSION_PRESETS,
} from '@/lib/configurator/presentation'
import { BifoldSchematicNote } from '@/components/configurator/BifoldSchematicNote'
import { CantileverSiteSpaceNote } from '@/components/configurator/CantileverSiteSpaceNote'
import { DimensionControl } from '@/components/configurator/DimensionControl'
import { DimensionMeaningNote } from '@/components/configurator/DimensionMeaningNote'
import { MeasurementGuide } from '@/components/configurator/MeasurementGuide'
import { RadiusSchematicNote } from '@/components/configurator/RadiusSchematicNote'
import { TelescopicSchematicNote } from '@/components/configurator/TelescopicSchematicNote'
import { TrackedRunbackNote } from '@/components/configurator/TrackedRunbackNote'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function DimensionsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const limits = getDimensionLimits(config.gateType)

  return (
    <div className="space-y-4">
      <MeasurementGuide />
      <DimensionMeaningNote gateType={config.gateType} />
      <BifoldSchematicNote gateType={config.gateType} />
      <TelescopicSchematicNote gateType={config.gateType} clearOpeningMm={config.widthMm} />
      <RadiusSchematicNote gateType={config.gateType} />

      <DimensionControl
        label={config.gateType === 'cantilever_sliding' ? 'Clear opening width' : 'Width'}
        value={config.widthMm}
        min={limits.minWidthMm}
        max={limits.maxWidthMm}
        presets={WIDTH_DIMENSION_PRESETS.filter(
          (preset) => preset.mm >= limits.minWidthMm && preset.mm <= limits.maxWidthMm,
        )}
        onChange={(widthMm) => patchConfig({ widthMm })}
      />

      {config.gateType === 'cantilever_sliding' ? (
        <CantileverSiteSpaceNote clearOpeningMm={config.widthMm} />
      ) : null}
      <TrackedRunbackNote gateType={config.gateType} clearOpeningMm={config.widthMm} />

      <DimensionControl
        label="Height"
        value={config.heightMm}
        min={limits.minHeightMm}
        max={limits.maxHeightMm}
        presets={HEIGHT_DIMENSION_PRESETS.filter(
          (preset) => preset.mm >= limits.minHeightMm && preset.mm <= limits.maxHeightMm,
        )}
        onChange={(heightMm) => patchConfig({ heightMm })}
      />
    </div>
  )
}
