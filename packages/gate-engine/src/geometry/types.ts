import type { GateConfig, GateStyle, GateType } from '../types'

export type TubeProfileMm = {
  outer: number
  wall?: number
}

export type VerticalZoneRatios = {
  topDecorative: number
  mainBody: number
  spearBand: number
  kickPlate: number
}

export type SwingRailLayout = {
  /** Normalized Y positions (0 = top of opening, 1 = bottom) */
  top: number
  upperMid: number
  spearBand: number
  lowerMid: number
  bottom: number
}

export type SwingPicketLayout = {
  upperCount: number
  lowerCount: number
  kickPlateMultiplier: number
  spacingMm: number
}

export type SwingFeatureFlags = {
  archedTop: boolean
  circleBands: boolean
  spearRow: boolean
  basketTwists: boolean
  centerLatch: boolean
  tubeProfile: boolean
}

export type SwingVictorianGeometryPlan = {
  kind: 'swing_victorian'
  gateType: GateType
  style: GateStyle
  leafCount: number
  widthMm: number
  heightMm: number
  zones: VerticalZoneRatios
  rails: SwingRailLayout
  pickets: SwingPicketLayout
  tubeProfile: TubeProfileMm
  features: SwingFeatureFlags
  notes: string[]
}

export type GateGeometryPlan = SwingVictorianGeometryPlan
