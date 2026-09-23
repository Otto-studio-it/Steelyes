export const GATE_TYPES = [
  'double_swing',
  'single_swing',
  'tracked_sliding',
  'cantilever_sliding',
  'bifolding_double_swing',
  'single_bifolding',
  'telescopic_sliding',
  'radius_sliding',
] as const

export type GateType = (typeof GATE_TYPES)[number]

export const GATE_STYLES = ['traditional_victorian', 'composite_boards'] as const

export type GateStyle = (typeof GATE_STYLES)[number]

export const GATE_OPTION_KEYS = [
  'middle_bar',
  'top_railheads',
  'dog_bars',
  'dog_bar_railheads',
  'arched_top',
  'circles',
  'picket_collars',
  'bushes',
  'spirals',
  'aluminium_panels',
] as const

export type GateOptionKey = (typeof GATE_OPTION_KEYS)[number]

/**
 * Client-confirmed standard colours (Marius, 2026-07): black in satin, matt or
 * gloss, anthracite RAL 7016, plus an "any other RAL code" escape hatch where
 * the customer writes the code in the quote notes and pricing is agreed after
 * the quotation request.
 */
export const FINISH_CODES = [
  'black_satin',
  'black_matt',
  'black_gloss',
  'anthracite_ral7016',
  'other_ral',
] as const

export type FinishCode = (typeof FINISH_CODES)[number]

/** Workshop fulfilment — install fee is never invented; quote confirms after survey. */
export const FULFILMENT_MODES = ['supply_and_install', 'supply_only'] as const

export type FulfilmentMode = (typeof FULFILMENT_MODES)[number]

export const GATE_MECHANISMS = GATE_TYPES

export type GateMechanism = GateType

import type { GatePostsConfig } from './posts'
import { DEFAULT_GATE_POSTS } from './posts'

export type { GatePostsConfig, PostCapStyle, PostMaterial } from './posts'
export {
  DEFAULT_GATE_POSTS,
  POST_CAP_EXTRA_GBP,
  POST_CAP_LABELS,
  POST_CAP_STYLES,
  POST_MATERIAL_LABELS,
  POST_MATERIALS,
} from './posts'

export type GateOptionSelection = {
  key: GateOptionKey
  enabled: boolean
  quantity?: number
  variant?: string
}

export type FencePanelSpec = {
  heightMm: number
  lengthMm: number
}

export type FencePanelInput = {
  quantity: number
  panels: FencePanelSpec[]
}

export type GateDimensions = {
  widthMm: number
  heightMm: number
}

export type GateConfig = GateDimensions & {
  version: 1
  gateType: GateType
  style: GateStyle
  motorised: boolean
  finish: FinishCode
  /** Hex `#RRGGBB` when finish is `other_ral`; ignored otherwise. */
  customFinishHex?: string | null
  siteSurveyRequested: boolean
  fulfilment: FulfilmentMode
  posts: GatePostsConfig
  options: GateOptionSelection[]
  fencePanels: FencePanelInput
}

export type GatePreset = {
  gateType: GateType
  style: GateStyle
  dimensions: GateDimensions
  motorised: boolean
  finish: FinishCode
  siteSurveyRequested: boolean
  fulfilment: FulfilmentMode
  posts: GatePostsConfig
  options: GateOptionSelection[]
  fencePanels: FencePanelInput
}

export const DEFAULT_CONFIG_VERSION = 1 as const

export const DEFAULT_FINISH: FinishCode = 'black_satin'
export const DEFAULT_SITE_SURVEY_REQUESTED = false
export const DEFAULT_FULFILMENT_MODE: FulfilmentMode = 'supply_and_install'

export const EMPTY_FENCE_PANEL_INPUT: FencePanelInput = {
  quantity: 0,
  panels: [],
}

export const DEFAULT_GATE_OPTIONS: GateOptionSelection[] = [
  { key: 'middle_bar', enabled: false, quantity: 0, variant: undefined },
  { key: 'top_railheads', enabled: false, quantity: 0, variant: undefined },
  { key: 'dog_bars', enabled: false, quantity: 0, variant: undefined },
  { key: 'dog_bar_railheads', enabled: false, quantity: 0, variant: undefined },
  { key: 'arched_top', enabled: false, quantity: 0, variant: undefined },
  { key: 'circles', enabled: false, quantity: 0, variant: undefined },
  { key: 'picket_collars', enabled: false, quantity: 0, variant: undefined },
  { key: 'bushes', enabled: false, quantity: 0, variant: undefined },
  { key: 'spirals', enabled: false, quantity: 0, variant: undefined },
  { key: 'aluminium_panels', enabled: false, quantity: 0, variant: undefined },
]

export const DEFAULT_GATE_PRESETS: Record<GateType, GatePreset> = {
  double_swing: {
    gateType: 'double_swing',
    style: 'traditional_victorian',
    dimensions: { widthMm: 1800, heightMm: 1000 },
    motorised: false,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  single_swing: {
    gateType: 'single_swing',
    style: 'traditional_victorian',
    dimensions: { widthMm: 900, heightMm: 1000 },
    motorised: false,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  tracked_sliding: {
    gateType: 'tracked_sliding',
    style: 'traditional_victorian',
    dimensions: { widthMm: 2500, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  cantilever_sliding: {
    gateType: 'cantilever_sliding',
    style: 'traditional_victorian',
    dimensions: { widthMm: 2500, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  bifolding_double_swing: {
    gateType: 'bifolding_double_swing',
    style: 'traditional_victorian',
    dimensions: { widthMm: 3000, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  single_bifolding: {
    gateType: 'single_bifolding',
    style: 'traditional_victorian',
    dimensions: { widthMm: 1600, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  telescopic_sliding: {
    gateType: 'telescopic_sliding',
    style: 'traditional_victorian',
    dimensions: { widthMm: 2100, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
  radius_sliding: {
    gateType: 'radius_sliding',
    style: 'traditional_victorian',
    dimensions: { widthMm: 1700, heightMm: 1000 },
    motorised: true,
    finish: DEFAULT_FINISH,
    siteSurveyRequested: DEFAULT_SITE_SURVEY_REQUESTED,
    fulfilment: DEFAULT_FULFILMENT_MODE,
    posts: structuredClone(DEFAULT_GATE_POSTS),
    options: structuredClone(DEFAULT_GATE_OPTIONS),
    fencePanels: structuredClone(EMPTY_FENCE_PANEL_INPUT),
  },
}

export function createGatePreset(gateType: GateType): GatePreset {
  return structuredClone(DEFAULT_GATE_PRESETS[gateType])
}

export function createGateConfig(preset: GatePreset): GateConfig {
  return {
    version: DEFAULT_CONFIG_VERSION,
    gateType: preset.gateType,
    style: preset.style,
    widthMm: preset.dimensions.widthMm,
    heightMm: preset.dimensions.heightMm,
    motorised: preset.motorised,
    finish: preset.finish,
    customFinishHex: null,
    siteSurveyRequested: preset.siteSurveyRequested,
    fulfilment: preset.fulfilment,
    posts: structuredClone(preset.posts ?? DEFAULT_GATE_POSTS),
    options: structuredClone(preset.options),
    fencePanels: structuredClone(preset.fencePanels),
  }
}
