import { GLOBAL_DIMENSION_LIMITS } from '@steelyes/gate-engine'
import type { GateOptionKey, GateType } from '@steelyes/gate-engine'

export const CONFIGURATOR_STORAGE_KEY = 'steelyes.configurator.v1'
export const CONFIGURATOR_SHARE_META_KEY = 'steelyes.configurator.share.v1'
export const PRIMARY_GATE_TYPE: GateType = 'double_swing'

/** Fence panels step is enabled for v2 multi-product flow. */
export const FENCE_PANELS_V1_ENABLED = true

export const CONFIGURATOR_STEPS = [
  { id: 'gate', label: 'Gate setup', shortLabel: 'Setup' },
  { id: 'dimensions', label: 'Dimensions', shortLabel: 'Size' },
  { id: 'posts', label: 'Mounting posts', shortLabel: 'Posts' },
  { id: 'options', label: 'Options', shortLabel: 'Options' },
  ...(FENCE_PANELS_V1_ENABLED
    ? [{ id: 'fence' as const, label: 'Fence panels', shortLabel: 'Fence' }]
    : []),
  { id: 'summary', label: 'Summary', shortLabel: 'Summary' },
] as const

export type ConfiguratorStepId = (typeof CONFIGURATOR_STEPS)[number]['id']

export type OptionMeta = {
  key: GateOptionKey
  label: string
  description: string
  quantityLabel?: string
}

export const OPTION_META: OptionMeta[] = [
  {
    key: 'middle_bar',
    label: 'Middle bar',
    description: 'Splits the gate visually into two parts.',
  },
  {
    key: 'top_railheads',
    label: 'Top railheads',
    description: 'Decorative top row shown schematically until final pricing is confirmed.',
    quantityLabel: 'Count',
  },
  {
    key: 'dog_bars',
    label: 'Dog bars',
    description: 'Lower reinforcement bars with indicative pricing.',
    quantityLabel: 'Count',
  },
  {
    key: 'dog_bar_railheads',
    label: 'Dog bar railheads',
    description: 'Second decorative row on the dog bars.',
    quantityLabel: 'Count',
  },
  {
    key: 'arched_top',
    label: 'Arched top',
    description: 'Curved top rail / bolta treatment.',
  },
  {
    key: 'bushes',
    label: 'Bushes',
    description: 'Small decorative inserts on the bars.',
    quantityLabel: 'Count',
  },
  {
    key: 'spirals',
    label: 'Spirals',
    description: 'Decorative spiral inserts on the bars.',
    quantityLabel: 'Count',
  },
]

export const WIDTH_PRESETS_MM = [900, 1200, 1500, 1800, 2000, 2400, 3000] as const
export const HEIGHT_PRESETS_MM = [900, 1000, 1100, 1200, 1500] as const

// Dimension limits are owned by the gate engine; re-exported here for UI convenience.
export const MIN_WIDTH_MM = GLOBAL_DIMENSION_LIMITS.minWidthMm
export const MAX_WIDTH_MM = GLOBAL_DIMENSION_LIMITS.maxWidthMm
export const MIN_HEIGHT_MM = GLOBAL_DIMENSION_LIMITS.minHeightMm
export const MAX_HEIGHT_MM = GLOBAL_DIMENSION_LIMITS.maxHeightMm
