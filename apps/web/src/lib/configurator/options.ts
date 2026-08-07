import type { GateOptionKey } from '@steelyes/gate-engine'

export type OptionGroupId = 'structure' | 'decoration' | 'site'

export const OPTION_GROUPS: {
  id: OptionGroupId
  label: string
  description: string
  keys: GateOptionKey[]
}[] = [
  {
    id: 'structure',
    label: 'Structure',
    description: 'Shape and layout of the gate frame.',
    keys: ['middle_bar', 'arched_top', 'aluminium_panels'],
  },
  {
    id: 'decoration',
    label: 'Decoration',
    description: 'Dog bars and ornamental inserts.',
    keys: ['dog_bars', 'bushes', 'spirals'],
  },
  {
    id: 'site',
    label: 'Site',
    description: 'Survey and installation preferences.',
    keys: [],
  },
]

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
    description: 'Decorative top row.',
    quantityLabel: 'Count',
  },
  {
    key: 'dog_bars',
    label: 'Dog bars',
    description: 'Lower reinforcement bars (£75 base).',
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
    description: 'Curved top rail.',
  },
  {
    key: 'aluminium_panels',
    label: 'Aluminium panels',
    description: 'Composite only — replace boards with aluminium (£250 + per panel/bar).',
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
