import {
  DEFAULT_CONFIG_VERSION,
  DEFAULT_FINISH,
  DEFAULT_GATE_OPTIONS,
  DEFAULT_GATE_PRESETS,
  EMPTY_FENCE_PANEL_INPUT,
  FINISH_CODES,
  GATE_OPTION_KEYS,
  GATE_STYLES,
  GATE_TYPES,
  type FencePanelInput,
  type FinishCode,
  type GateConfig,
  type GateOptionKey,
  type GateOptionSelection,
  type GatePreset,
  type GateStyle,
  type GateType,
} from './types'

export type ValidationIssue = {
  field: string
  code: string
  message: string
}

export type ValidationResult<T> =
  | {
      ok: true
      value: T
    }
  | {
      ok: false
      issues: ValidationIssue[]
    }

const MIN_WIDTH_MM = 600
const MAX_WIDTH_MM = 6000
const MIN_HEIGHT_MM = 600
const MAX_HEIGHT_MM = 3000

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isGateType(value: unknown): value is GateType {
  return typeof value === 'string' && (GATE_TYPES as readonly string[]).includes(value)
}

function isGateStyle(value: unknown): value is GateStyle {
  return typeof value === 'string' && (GATE_STYLES as readonly string[]).includes(value)
}

function isFinishCode(value: unknown): value is FinishCode {
  return typeof value === 'string' && (FINISH_CODES as readonly string[]).includes(value)
}

function isGateOptionKey(value: unknown): value is GateOptionKey {
  return typeof value === 'string' && (GATE_OPTION_KEYS as readonly string[]).includes(value)
}

function toIntegerOrNull(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  if (!Number.isInteger(value)) return null
  return value
}

function normalizeOptionSelection(option: Partial<GateOptionSelection> | undefined): GateOptionSelection | null {
  if (!option || !isGateOptionKey(option.key)) return null

  const enabled = Boolean(option.enabled)
  const quantity = toIntegerOrNull(option.quantity)

  return {
    key: option.key,
    enabled,
    quantity: quantity === null ? 0 : Math.max(quantity, 0),
    variant: typeof option.variant === 'string' && option.variant.trim() ? option.variant.trim() : undefined,
  }
}

function normalizeFencePanels(input: unknown): FencePanelInput {
  if (!isObject(input)) return structuredClone(EMPTY_FENCE_PANEL_INPUT)

  const quantity = toIntegerOrNull(input.quantity)
  const rawPanels = Array.isArray(input.panels) ? input.panels : []

  const panels = rawPanels
    .filter(isObject)
    .map((panel) => {
      const heightMm = toIntegerOrNull(panel.heightMm)
      const lengthMm = toIntegerOrNull(panel.lengthMm)
      if (heightMm === null || lengthMm === null) return null
      return {
        heightMm: Math.max(heightMm, 0),
        lengthMm: Math.max(lengthMm, 0),
      }
    })
    .filter((panel): panel is { heightMm: number; lengthMm: number } => panel !== null)

  return {
    quantity: quantity === null ? 0 : Math.max(quantity, 0),
    panels,
  }
}

export function normalizeGateConfig(
  input: Partial<GateConfig> & { gateType?: unknown } = {},
  fallbackGateType: GateType = 'double_swing',
): GateConfig {
  const gateType = isGateType(input.gateType) ? input.gateType : fallbackGateType
  const preset: GatePreset = DEFAULT_GATE_PRESETS[gateType]

  const widthMm = toIntegerOrNull(input.widthMm)
  const heightMm = toIntegerOrNull(input.heightMm)

  const options = Array.isArray(input.options)
    ? input.options.map((option) => normalizeOptionSelection(option as Partial<GateOptionSelection>)).filter(Boolean)
    : structuredClone(DEFAULT_GATE_OPTIONS)

  const normalizedOptions = DEFAULT_GATE_OPTIONS.map((defaultOption) => {
    const match = options.find((option) => option?.key === defaultOption.key)
    return match ? match : structuredClone(defaultOption)
  }) as GateOptionSelection[]

  return {
    version: DEFAULT_CONFIG_VERSION,
    gateType,
    style: isGateStyle(input.style) ? input.style : preset.style,
    widthMm: widthMm === null ? preset.dimensions.widthMm : Math.max(widthMm, MIN_WIDTH_MM),
    heightMm: heightMm === null ? preset.dimensions.heightMm : Math.max(heightMm, MIN_HEIGHT_MM),
    motorised: typeof input.motorised === 'boolean' ? input.motorised : preset.motorised,
    finish: isFinishCode(input.finish) ? input.finish : DEFAULT_FINISH,
    options: normalizedOptions,
    fencePanels: normalizeFencePanels(input.fencePanels),
  }
}

export function validateGateConfig(config: GateConfig): ValidationResult<GateConfig> {
  const issues: ValidationIssue[] = []

  if (!isGateType(config.gateType)) {
    issues.push({
      field: 'gateType',
      code: 'invalid_gate_type',
      message: 'Gate type is not supported.',
    })
  }

  if (!isGateStyle(config.style)) {
    issues.push({
      field: 'style',
      code: 'invalid_style',
      message: 'Gate style is not supported.',
    })
  }

  if (!isFinishCode(config.finish)) {
    issues.push({
      field: 'finish',
      code: 'invalid_finish',
      message: 'Finish is not supported.',
    })
  }

  if (!Number.isInteger(config.widthMm) || config.widthMm < MIN_WIDTH_MM || config.widthMm > MAX_WIDTH_MM) {
    issues.push({
      field: 'widthMm',
      code: 'invalid_width',
      message: `Width must be between ${MIN_WIDTH_MM}mm and ${MAX_WIDTH_MM}mm.`,
    })
  }

  if (!Number.isInteger(config.heightMm) || config.heightMm < MIN_HEIGHT_MM || config.heightMm > MAX_HEIGHT_MM) {
    issues.push({
      field: 'heightMm',
      code: 'invalid_height',
      message: `Height must be between ${MIN_HEIGHT_MM}mm and ${MAX_HEIGHT_MM}mm.`,
    })
  }

  const optionKeys = new Set<string>()
  for (const option of config.options) {
    if (!isGateOptionKey(option.key)) {
      issues.push({
        field: `options.${option.key}`,
        code: 'invalid_option_key',
        message: 'Option key is not supported.',
      })
      continue
    }

    if (optionKeys.has(option.key)) {
      issues.push({
        field: `options.${option.key}`,
        code: 'duplicate_option',
        message: 'Option key is duplicated.',
      })
    }
    optionKeys.add(option.key)

    if (typeof option.enabled !== 'boolean') {
      issues.push({
        field: `options.${option.key}.enabled`,
        code: 'invalid_option_enabled',
        message: 'Option enabled flag must be a boolean.',
      })
    }

    if (option.quantity !== undefined) {
      if (!Number.isInteger(option.quantity) || option.quantity < 0) {
        issues.push({
          field: `options.${option.key}.quantity`,
          code: 'invalid_option_quantity',
          message: 'Option quantity must be a non-negative integer.',
        })
      }
    }

    if (option.variant !== undefined && typeof option.variant !== 'string') {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'invalid_option_variant',
        message: 'Option variant must be a string when provided.',
      })
    }
  }

  const fencePanels = config.fencePanels
  if (!Number.isInteger(fencePanels.quantity) || fencePanels.quantity < 0) {
    issues.push({
      field: 'fencePanels.quantity',
      code: 'invalid_fence_panel_quantity',
      message: 'Fence panel quantity must be a non-negative integer.',
    })
  }

  if (!Array.isArray(fencePanels.panels)) {
    issues.push({
      field: 'fencePanels.panels',
      code: 'invalid_fence_panel_list',
      message: 'Fence panel list must be an array.',
    })
  } else {
    fencePanels.panels.forEach((panel, index) => {
      if (!Number.isInteger(panel.heightMm) || panel.heightMm <= 0) {
        issues.push({
          field: `fencePanels.panels[${index}].heightMm`,
          code: 'invalid_fence_panel_height',
          message: 'Fence panel height must be a positive integer.',
        })
      }
      if (!Number.isInteger(panel.lengthMm) || panel.lengthMm <= 0) {
        issues.push({
          field: `fencePanels.panels[${index}].lengthMm`,
          code: 'invalid_fence_panel_length',
          message: 'Fence panel length must be a positive integer.',
        })
      }
    })
  }

  if (fencePanels.quantity !== fencePanels.panels.length) {
    issues.push({
      field: 'fencePanels.quantity',
      code: 'fence_panel_quantity_mismatch',
      message: 'Fence panel quantity must match the number of panel entries.',
    })
  }

  const hasUnknownVersion = config.version !== DEFAULT_CONFIG_VERSION
  if (hasUnknownVersion) {
    issues.push({
      field: 'version',
      code: 'invalid_version',
      message: `Config version must be ${DEFAULT_CONFIG_VERSION}.`,
    })
  }

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, value: config }
}
