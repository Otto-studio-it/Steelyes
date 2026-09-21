import { DEFAULT_CONFIG_VERSION, type FencePanelInput, type GateConfig, type GateOptionSelection } from './types'
import {
  normalizeGateConfig,
  validateGateConfig,
  validateGateConfigSerializedInput,
} from './validation'

export type SerializedGateOptionSelection = {
  key: GateOptionSelection['key']
  enabled: boolean
  quantity?: number
  variant?: string
}

export type SerializedFencePanelInput = FencePanelInput

export type SerializedGateConfigV1 = {
  version: 1
  gateType: GateConfig['gateType']
  style: GateConfig['style']
  widthMm: number
  heightMm: number
  motorised: boolean
  finish: GateConfig['finish']
  customFinishHex?: string | null
  siteSurveyRequested: boolean
  fulfilment?: GateConfig['fulfilment']
  posts?: GateConfig['posts']
  options: SerializedGateOptionSelection[]
  fencePanels: SerializedFencePanelInput
}

export type SerializedGateConfig = SerializedGateConfigV1

function normalizeSerializedOption(option: GateOptionSelection): SerializedGateOptionSelection {
  return {
    key: option.key,
    enabled: option.enabled,
    quantity: option.quantity,
    variant: option.variant,
  }
}

export function serializeGateConfig(config: GateConfig): SerializedGateConfigV1 {
  return {
    version: DEFAULT_CONFIG_VERSION,
    gateType: config.gateType,
    style: config.style,
    widthMm: config.widthMm,
    heightMm: config.heightMm,
    motorised: config.motorised,
    finish: config.finish,
    customFinishHex: config.finish === 'other_ral' ? config.customFinishHex ?? null : null,
    siteSurveyRequested: config.siteSurveyRequested,
    fulfilment: config.fulfilment,
    posts: structuredClone(config.posts),
    options: config.options.map(normalizeSerializedOption),
    fencePanels: structuredClone(config.fencePanels),
  }
}

export function stringifyGateConfig(config: GateConfig): string {
  return JSON.stringify(serializeGateConfig(config))
}

/**
 * Finish codes retired on 2026-07-24 (real client palette). Designs saved before that still carry
 * them; without this they fail validation — 404 on the share page, 500 on the quote PDF.
 * Black maps to its direct successor; the other colours have no successor, so they are kept
 * exactly as a custom colour with their original hex.
 */
const LEGACY_FINISHES: Record<string, { finish: GateConfig['finish']; customFinishHex: string | null }> = {
  matte_black: { finish: 'black_matt', customFinishHex: null },
  zinc_grey: { finish: 'other_ral', customFinishHex: '#8A9199' },
  bronze: { finish: 'other_ral', customFinishHex: '#8B6914' },
  pearl_white: { finish: 'other_ral', customFinishHex: '#E8E4DD' },
}

function migrateLegacyFinish<T extends { finish?: unknown; customFinishHex?: unknown }>(raw: T): T {
  if (!raw || typeof raw !== 'object' || typeof raw.finish !== 'string') return raw
  const replacement = Object.prototype.hasOwnProperty.call(LEGACY_FINISHES, raw.finish)
    ? LEGACY_FINISHES[raw.finish]
    : undefined
  return replacement ? { ...raw, ...replacement } : raw
}

export function deserializeGateConfig(serialized: SerializedGateConfig | string): GateConfig {
  const parsed = typeof serialized === 'string' ? (JSON.parse(serialized) as Partial<SerializedGateConfigV1>) : serialized
  const raw = migrateLegacyFinish(parsed)
  const shapeValidation = validateGateConfigSerializedInput(raw)
  if (!shapeValidation.ok) {
    const error = new Error('Invalid serialized gate config')
    ;(error as Error & { issues?: unknown }).issues = [...shapeValidation.issues]
    throw error
  }

  const normalized = normalizeGateConfig(
    {
      gateType: raw.gateType,
      style: raw.style,
      widthMm: raw.widthMm,
      heightMm: raw.heightMm,
      motorised: raw.motorised,
      finish: raw.finish,
      customFinishHex: raw.customFinishHex,
      siteSurveyRequested: raw.siteSurveyRequested,
      fulfilment: raw.fulfilment,
      posts: raw.posts,
      options: Array.isArray(raw.options) ? raw.options : undefined,
      fencePanels: raw.fencePanels,
      version: raw.version,
    },
    raw.gateType && typeof raw.gateType === 'string' ? (raw.gateType as GateConfig['gateType']) : 'double_swing',
  )

  const result = validateGateConfig(normalized)
  if (!result.ok) {
    const error = new Error('Invalid serialized gate config')
    ;(error as Error & { issues?: unknown }).issues = result.issues
    throw error
  }

  return result.value
}

export function parseGateConfigJson(serialized: string): GateConfig {
  return deserializeGateConfig(serialized)
}
