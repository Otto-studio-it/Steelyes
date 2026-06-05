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
  siteSurveyRequested: boolean
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
    siteSurveyRequested: config.siteSurveyRequested,
    options: config.options.map(normalizeSerializedOption),
    fencePanels: structuredClone(config.fencePanels),
  }
}

export function stringifyGateConfig(config: GateConfig): string {
  return JSON.stringify(serializeGateConfig(config))
}

export function deserializeGateConfig(serialized: SerializedGateConfig | string): GateConfig {
  const raw = typeof serialized === 'string' ? (JSON.parse(serialized) as Partial<SerializedGateConfigV1>) : serialized
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
      siteSurveyRequested: raw.siteSurveyRequested,
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
