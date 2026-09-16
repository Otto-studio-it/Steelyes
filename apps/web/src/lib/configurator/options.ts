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
    description: 'On/off — Design CAD follows Victorian shape. Circles swap the workshop master.',
    keys: ['dog_bars', 'circles', 'top_railheads'],
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
    description:
      'Priced extra. Design CAD draws it. The workshop Victorian master already has a mid rail and does not swap.',
  },
  {
    key: 'top_railheads',
    label: 'Top railheads',
    description: 'On/off. Count is automatic (one per bay). Workshop / quote only (CA-17).',
  },
  {
    key: 'dog_bars',
    label: 'Dog bars',
    description:
      'On/off. Same control as Gate shape on Choose. Density is automatic (CA-15). Unavailable on Composite.',
  },
  {
    key: 'dog_bar_railheads',
    label: 'Dog bar railheads',
    description: 'Second decorative row on the dog bars — model only; count automatic.',
  },
  {
    key: 'arched_top',
    label: 'Arched top',
    description: 'Curved top rail — same control as Gate shape on Choose. Design CAD follows it.',
  },
  {
    key: 'aluminium_panels',
    label: 'Aluminium panels',
    description: 'Composite only — replace boards with aluminium (£250 + per panel/bar).',
  },
  {
    key: 'circles',
    label: 'Circles',
    description: 'On/off — upper + lower bands together (Q1). Drawn on the workshop plate, not yet on Design CAD. Unavailable on Composite.',
  },
  {
    key: 'picket_collars',
    label: 'Picket collars',
    description:
      'On/off — mid-height boss on long pickets (never on dog bars). Drawn on the workshop plate, not yet on Design CAD. Unavailable on Composite.',
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
