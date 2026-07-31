'use client'

import {
  HEIGHT_DIMENSION_PRESETS,
  MAX_HEIGHT_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MIN_WIDTH_MM,
  WIDTH_DIMENSION_PRESETS,
} from '@/lib/configurator/presentation'
import { BifoldSchematicNote } from '@/components/configurator/BifoldSchematicNote'
import { CantileverSiteSpaceNote } from '@/components/configurator/CantileverSiteSpaceNote'
import { DimensionControl } from '@/components/configurator/DimensionControl'
import { DimensionMeaningNote } from '@/components/configurator/DimensionMeaningNote'
import { MeasurementGuide } from '@/components/configurator/MeasurementGuide'
import { RadiusSchematicNote } from '@/components/configurator/RadiusSchematicNote'
import { TelescopicSchematicNote } from '@/components/configurator/TelescopicSchematicNote'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function DimensionsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)

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
        min={MIN_WIDTH_MM}
        max={MAX_WIDTH_MM}
        presets={WIDTH_DIMENSION_PRESETS}
        onChange={(widthMm) => patchConfig({ widthMm })}
      />

      {config.gateType === 'cantilever_sliding' ? (
        <CantileverSiteSpaceNote clearOpeningMm={config.widthMm} />
      ) : null}

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
