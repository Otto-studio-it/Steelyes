import { GLOBAL_DIMENSION_LIMITS, type GateStyle, type GateType } from '@steelyes/gate-engine'

export type DimensionPreset = {
  mm: number
  label: string
}

export const WIDTH_DIMENSION_PRESETS: DimensionPreset[] = [
  { mm: 900, label: 'Pedestrian (900 mm)' },
  { mm: 1200, label: 'Side access (1.2 m)' },
  { mm: 1500, label: 'Compact drive (1.5 m)' },
  { mm: 1800, label: 'Driveway standard (1.8 m)' },
  { mm: 2000, label: 'Wide opening (2 m)' },
  { mm: 2400, label: 'Double drive (2.4 m)' },
  { mm: 3000, label: 'Commercial (3 m)' },
]

export const HEIGHT_DIMENSION_PRESETS: DimensionPreset[] = [
  { mm: 900, label: 'Low privacy (900 mm)' },
  { mm: 1000, label: 'Standard (1 m)' },
  { mm: 1100, label: 'Medium (1.1 m)' },
  { mm: 1200, label: 'Tall (1.2 m)' },
  { mm: 1500, label: 'High security (1.5 m)' },
]

export const GATE_TYPE_IMAGES: Partial<Record<GateType, string>> = {
  double_swing: '/images/gates/classic-ornate-driveway-gate-arch.jpg',
  single_swing: '/images/gates/pedestrian-gate-ornate-brick.jpg',
  tracked_sliding: '/images/gates/sliding-gate-anthracite-residential.jpg',
  cantilever_sliding: '/images/gates/sliding-gate-spear-finials.jpg',
  bifolding_double_swing: '/images/home/modern-diagonal-steel-gate.jpg',
  single_bifolding: '/images/home/privacy-horizontal-steel-gate.jpg',
  telescopic_sliding: '/images/gates/sliding-gate-automated-open.jpg',
  radius_sliding: '/images/gates/sliding-gate-classic-ornate-tudor.jpg',
}

export const STYLE_IMAGES: Record<GateStyle, string> = {
  traditional_victorian: '/images/gates/classic-ornate-driveway-gate-arch.jpg',
  composite_boards: '/images/home/privacy-horizontal-steel-gate.jpg',
}

export const WIDTH_PRESETS_MM = [900, 1200, 1500, 1800, 2000, 2400, 3000] as const
export const HEIGHT_PRESETS_MM = [900, 1000, 1100, 1200, 1500] as const

/** Curated 2-preset width chips for the mobile Quick Path (plus a Custom escape). */
export type MobileQuickWidthPreset = {
  mm: number
  label: string
  sublabel: string
}

export const MOBILE_QUICK_WIDTH_PRESETS: readonly MobileQuickWidthPreset[] = [
  { mm: 1800, label: 'Standard drive', sublabel: 'Most UK driveways' },
  { mm: 2400, label: 'Wide opening', sublabel: 'Double drive' },
]

// Dimension limits are owned by the gate engine; re-exported here for UI convenience.
export const MIN_WIDTH_MM = GLOBAL_DIMENSION_LIMITS.minWidthMm
export const MAX_WIDTH_MM = GLOBAL_DIMENSION_LIMITS.maxWidthMm
export const MIN_HEIGHT_MM = GLOBAL_DIMENSION_LIMITS.minHeightMm
export const MAX_HEIGHT_MM = GLOBAL_DIMENSION_LIMITS.maxHeightMm
