import type { GateType } from '@steelyes/gate-engine'

export const CONFIGURATOR_STORAGE_KEY = 'steelyes.configurator.v1'
export const CONFIGURATOR_SHARE_META_KEY = 'steelyes.configurator.share.v1'
export const PRIMARY_GATE_TYPE: GateType = 'double_swing'

/** Mobile Quick Path: 3 linear screens (gate look → opening → quote). */
export type ConfiguratorFlowMode = 'quick' | 'studio'
export const QUICK_PATH_STEP_COUNT = 3

/** Quick Path step → Design Studio act equivalent (used when switching flows). */
export const QUICK_STEP_TO_ACT: readonly ConfiguratorActId[] = ['choose', 'define', 'summary']

/** Fence panels step is enabled for v2 multi-product flow. */
export const FENCE_PANELS_V1_ENABLED = true

/** Legacy step ids — used for validation field mapping. */
export const CONFIGURATOR_STEPS = [
  { id: 'gate', label: 'Gate setup', shortLabel: 'Setup' },
  { id: 'dimensions', label: 'Dimensions', shortLabel: 'Size' },
  { id: 'posts', label: 'Mounting posts', shortLabel: 'Posts' },
  { id: 'options', label: 'Options', shortLabel: 'Options' },
  ...(FENCE_PANELS_V1_ENABLED
    ? [{ id: 'fence' as const, label: 'Railing panels', shortLabel: 'Railings' }]
    : []),
  { id: 'summary', label: 'Summary', shortLabel: 'Summary' },
] as const

export type ConfiguratorStepId = (typeof CONFIGURATOR_STEPS)[number]['id']

/** Design Studio acts — primary navigation (3 acts + summary). */
export const CONFIGURATOR_ACTS = [
  {
    id: 'choose',
    label: 'Choose your gate',
    shortLabel: 'Choose',
    overline: 'Act 1',
  },
  {
    id: 'define',
    label: 'Define your opening',
    shortLabel: 'Define',
    overline: 'Act 2',
  },
  {
    id: 'refine',
    label: 'Refine',
    shortLabel: 'Refine',
    overline: 'Act 3',
  },
  {
    id: 'summary',
    label: 'Summary',
    shortLabel: 'Summary',
    overline: 'Quote',
  },
] as const

export type ConfiguratorActId = (typeof CONFIGURATOR_ACTS)[number]['id']
