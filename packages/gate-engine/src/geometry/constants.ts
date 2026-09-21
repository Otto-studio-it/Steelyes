import type { VerticalZoneRatios } from './types'

/** From gate-audit double_swing Victorian photo analysis (docs/frontend/gate-audits/double_swing/) */
export const VICTORIAN_DOUBLE_SWING_ZONE_RATIOS: VerticalZoneRatios = {
  topDecorative: 0.14,
  mainBody: 0.48,
  spearBand: 0.09,
  kickPlate: 0.29,
}

export const DEFAULT_PICKET_SPACING_MM = 100
/** Leaf frame tube (stiles / rails). */
export const DEFAULT_TUBE_OUTER_MM = 40
/** Infill picket tube — lighter than the frame. Schematic until fabrication standards are confirmed. */
export const DEFAULT_PICKET_OUTER_MM = 20
export const DEFAULT_TUBE_WALL_MM = 2.5

export const SWING_RAIL_COUNT = 4
