import {
  getDecorativeBarCapacity,
  getExpectedTopRailheadCount,
} from '../rules/geometry'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import {
  DEFAULT_PICKET_SPACING_MM,
  DEFAULT_TUBE_OUTER_MM,
  DEFAULT_TUBE_WALL_MM,
  SWING_RAIL_COUNT,
  VICTORIAN_DOUBLE_SWING_ZONE_RATIOS,
} from './constants'
import type { SwingRailLayout, SwingVictorianGeometryPlan, VerticalZoneRatios } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hasOption(config: GateConfig, key: string): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function getLeafCount(gateType: GateConfig['gateType']): number {
  if (gateType === 'double_swing' || gateType === 'bifolding_double_swing') {
    return 2
  }
  return 1
}

function isSwingGate(gateType: GateConfig['gateType']): boolean {
  // single_bifolding does not contain "swing" but shares the Victorian leaf recipe.
  return gateType.includes('swing') || gateType === 'single_bifolding'
}

export function buildSwingRailLayout(zones: VerticalZoneRatios): SwingRailLayout {
  const upperMid = zones.topDecorative
  const spearBand = upperMid + zones.mainBody
  const lowerMid = spearBand + zones.spearBand
  const bottom = 1 - 0.02

  return {
    top: 0,
    upperMid,
    spearBand,
    lowerMid,
    bottom,
  }
}

export function buildSwingVictorianGeometryPlan(config: GateConfig): SwingVictorianGeometryPlan | null {
  if (config.style !== 'traditional_victorian') {
    return null
  }

  if (!isSwingGate(config.gateType)) {
    return null
  }

  const zones = VICTORIAN_DOUBLE_SWING_ZONE_RATIOS
  const rails = buildSwingRailLayout(zones)
  const leafWidthMm = config.widthMm / getLeafCount(config.gateType)
  const upperCount = clamp(Math.round(leafWidthMm / DEFAULT_PICKET_SPACING_MM), 6, 18)
  const lowerCount = clamp(Math.round(config.widthMm / 90), 16, 28)

  const notes = [
    `Geometry recipe: ${SWING_RAIL_COUNT} horizontal rails, zone ratios from gate-audit reference.`,
    'Picket spacing and tube profile are schematic until Marius confirms fabrication standards.',
  ]

  if (hasOption(config, 'arched_top')) {
    notes.push('Arched top adds visual rise above rectangular heightMm — catalog height scope pending client confirmation.')
  }

  return {
    kind: 'swing_victorian',
    gateType: config.gateType,
    style: config.style,
    leafCount: getLeafCount(config.gateType),
    widthMm: config.widthMm,
    heightMm: config.heightMm,
    zones,
    rails,
    pickets: {
      upperCount,
      lowerCount,
      kickPlateMultiplier: hasOption(config, 'dog_bars') ? 2 : 1,
      spacingMm: DEFAULT_PICKET_SPACING_MM,
    },
    tubeProfile: {
      outer: DEFAULT_TUBE_OUTER_MM,
      wall: DEFAULT_TUBE_WALL_MM,
    },
    features: {
      archedTop: hasOption(config, 'arched_top'),
      circleBands: hasOption(config, 'bushes'),
      spearRow: hasOption(config, 'dog_bar_railheads'),
      basketTwists: hasOption(config, 'spirals'),
      centerLatch: getLeafCount(config.gateType) > 1,
      tubeProfile: true,
    },
    notes,
  }
}

export function buildGateGeometryPlan(config: GateConfig): SwingVictorianGeometryPlan | null {
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    return null
  }

  return buildSwingVictorianGeometryPlan(config)
}

export function getExpectedFinialCapacity(config: GateConfig): number {
  return getExpectedTopRailheadCount(config.widthMm)
}

export function getDecorativeCapacity(config: GateConfig): number {
  return getDecorativeBarCapacity(config)
}
