import {
  DEFAULT_CONFIG_VERSION,
  DEFAULT_FINISH,
  DEFAULT_GATE_OPTIONS,
  DEFAULT_GATE_PRESETS,
  DEFAULT_SITE_SURVEY_REQUESTED,
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
import { collectVariantCatalogIssues } from './catalog/variants'
import { GLOBAL_DIMENSION_LIMITS, getDimensionLimits } from './dimension-limits'
import { clamp } from './internal/shared'
import { normalizeGatePosts } from './posts'
import { collectCompatibilityIssues } from './rules/compatibility'
import { collectGeometryIssues } from './rules/geometry'

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

// Standard fence panels in this configurator slice use a fixed 900–1000 mm length band.
const MIN_FENCE_PANEL_LENGTH_MM = 900
const MAX_FENCE_PANEL_LENGTH_MM = 1000

/** Options priced as a single flat add-on: quantity above 1 has no meaning. */
const SINGLE_INSTANCE_OPTION_KEYS: readonly GateOptionKey[] = ['middle_bar', 'arched_top']
const VALIDATION_DRAFT_MODE = 'draft'
const VALIDATION_SERIALIZED_MODE = 'serialized'

type GateConfigPayloadMode = typeof VALIDATION_DRAFT_MODE | typeof VALIDATION_SERIALIZED_MODE

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
  const sanitizedQuantity = quantity === null ? 0 : Math.max(quantity, 0)

  return {
    key: option.key,
    enabled,
    quantity: SINGLE_INSTANCE_OPTION_KEYS.includes(option.key)
      ? Math.min(sanitizedQuantity, 1)
      : sanitizedQuantity,
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
        lengthMm: Math.min(MAX_FENCE_PANEL_LENGTH_MM, Math.max(lengthMm, MIN_FENCE_PANEL_LENGTH_MM)),
      }
    })
    .filter((panel): panel is { heightMm: number; lengthMm: number } => panel !== null)

  return {
    quantity: quantity === null ? 0 : Math.max(quantity, 0),
    panels,
  }
}

function collectGateConfigPayloadIssues(input: unknown, mode: GateConfigPayloadMode): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!isObject(input)) {
    issues.push({
      field: 'config',
      code: 'invalid_input',
      message: 'Configuration payload must be an object.',
    })
    return issues
  }

  if ('version' in input && input.version !== undefined && input.version !== DEFAULT_CONFIG_VERSION) {
    issues.push({
      field: 'version',
      code: 'invalid_version',
      message: `Config version must be ${DEFAULT_CONFIG_VERSION}.`,
    })
  }

  if (mode === VALIDATION_SERIALIZED_MODE) {
    if ('gateType' in input && !isGateType(input.gateType)) {
      issues.push({
        field: 'gateType',
        code: 'invalid_gate_type',
        message: 'Gate type is not supported.',
      })
    }

    if ('style' in input && !isGateStyle(input.style)) {
      issues.push({
        field: 'style',
        code: 'invalid_style',
        message: 'Gate style is not supported.',
      })
    }

    if ('finish' in input && !isFinishCode(input.finish)) {
      issues.push({
        field: 'finish',
        code: 'invalid_finish',
        message: 'Finish is not supported.',
      })
    }

    if ('motorised' in input && typeof input.motorised !== 'boolean') {
      issues.push({
        field: 'motorised',
        code: 'invalid_motorised',
        message: 'Motorised flag must be a boolean.',
      })
    }

    if ('siteSurveyRequested' in input && typeof input.siteSurveyRequested !== 'boolean') {
      issues.push({
        field: 'siteSurveyRequested',
        code: 'invalid_site_survey_requested',
        message: 'Site survey request flag must be a boolean.',
      })
    }

    const serializedLimits = isGateType(input.gateType)
      ? getDimensionLimits(input.gateType)
      : GLOBAL_DIMENSION_LIMITS

    const widthMm = input.widthMm
    if ('widthMm' in input && (typeof widthMm !== 'number' || !Number.isInteger(widthMm) || widthMm < serializedLimits.minWidthMm || widthMm > serializedLimits.maxWidthMm)) {
      issues.push({
        field: 'widthMm',
        code: 'invalid_width',
        message: `Width must be between ${serializedLimits.minWidthMm}mm and ${serializedLimits.maxWidthMm}mm.`,
      })
    }

    const heightMm = input.heightMm
    if ('heightMm' in input && (typeof heightMm !== 'number' || !Number.isInteger(heightMm) || heightMm < serializedLimits.minHeightMm || heightMm > serializedLimits.maxHeightMm)) {
      issues.push({
        field: 'heightMm',
        code: 'invalid_height',
        message: `Height must be between ${serializedLimits.minHeightMm}mm and ${serializedLimits.maxHeightMm}mm.`,
      })
    }
  }

  if ('options' in input && input.options !== undefined) {
    if (!Array.isArray(input.options)) {
      issues.push({
        field: 'options',
        code: 'invalid_option_list',
        message: 'Options must be provided as an array.',
      })
    } else {
      const seenOptionKeys = new Set<string>()

      input.options.forEach((option, index) => {
        if (!isObject(option)) {
          issues.push({
            field: `options[${index}]`,
            code: 'invalid_option_shape',
            message: 'Option entry must be an object.',
          })
          return
        }

        if (!isGateOptionKey(option.key)) {
          issues.push({
            field: `options[${index}].key`,
            code: 'invalid_option_key',
            message: 'Option key is not supported.',
          })
          return
        }

        if (seenOptionKeys.has(option.key)) {
          issues.push({
            field: `options.${option.key}`,
            code: 'duplicate_option',
            message: 'Option key is duplicated.',
          })
        }
        seenOptionKeys.add(option.key)

        if ('enabled' in option && typeof option.enabled !== 'boolean') {
          issues.push({
            field: `options[${index}].enabled`,
            code: 'invalid_option_enabled',
            message: 'Option enabled flag must be a boolean.',
          })
        }

        if ('quantity' in option && (typeof option.quantity !== 'number' || !Number.isInteger(option.quantity) || option.quantity < 0)) {
          issues.push({
            field: `options[${index}].quantity`,
            code: 'invalid_option_quantity',
            message: 'Option quantity must be a non-negative integer.',
          })
        }

        if ('variant' in option && option.variant !== undefined && typeof option.variant !== 'string') {
          issues.push({
            field: `options[${index}].variant`,
            code: 'invalid_option_variant',
            message: 'Option variant must be a string when provided.',
          })
        }
      })
    }
  }

  if ('fencePanels' in input && input.fencePanels !== undefined) {
    if (!isObject(input.fencePanels)) {
      issues.push({
        field: 'fencePanels',
        code: 'invalid_fence_panel_shape',
        message: 'Fence panels must be provided as an object.',
      })
    } else {
      const fencePanelQuantity = input.fencePanels.quantity
      if (typeof fencePanelQuantity !== 'number' || !Number.isInteger(fencePanelQuantity) || fencePanelQuantity < 0) {
        issues.push({
          field: 'fencePanels.quantity',
          code: 'invalid_fence_panel_quantity',
          message: 'Fence panel quantity must be a non-negative integer.',
        })
      }

      if (!Array.isArray(input.fencePanels.panels)) {
        issues.push({
          field: 'fencePanels.panels',
          code: 'invalid_fence_panel_list',
          message: 'Fence panel list must be an array.',
        })
      } else {
        input.fencePanels.panels.forEach((panel, index) => {
          if (!isObject(panel)) {
            issues.push({
              field: `fencePanels.panels[${index}]`,
              code: 'invalid_fence_panel_shape',
              message: 'Fence panel entry must be an object.',
            })
            return
          }

          const heightMm = panel.heightMm
          if (typeof heightMm !== 'number' || !Number.isInteger(heightMm) || heightMm <= 0) {
            issues.push({
              field: `fencePanels.panels[${index}].heightMm`,
              code: 'invalid_fence_panel_height',
              message: 'Fence panel height must be a positive integer.',
            })
          }
          const lengthMm = panel.lengthMm
          if (typeof lengthMm !== 'number' || !Number.isInteger(lengthMm) || lengthMm <= 0) {
            issues.push({
              field: `fencePanels.panels[${index}].lengthMm`,
              code: 'invalid_fence_panel_length',
              message: 'Fence panel length must be a positive integer.',
            })
          } else if (lengthMm < MIN_FENCE_PANEL_LENGTH_MM || lengthMm > MAX_FENCE_PANEL_LENGTH_MM) {
            issues.push({
              field: `fencePanels.panels[${index}].lengthMm`,
              code: 'invalid_fence_panel_length_range',
              message: `Fence panel length must be between ${MIN_FENCE_PANEL_LENGTH_MM}mm and ${MAX_FENCE_PANEL_LENGTH_MM}mm.`,
            })
          }
        })

        if (
          isObject(input.fencePanels) &&
          typeof fencePanelQuantity === 'number' &&
          Number.isInteger(fencePanelQuantity) &&
          fencePanelQuantity !== input.fencePanels.panels.length
        ) {
          issues.push({
            field: 'fencePanels.quantity',
            code: 'fence_panel_quantity_mismatch',
            message: 'Fence panel quantity must match the number of panel entries.',
          })
        }
      }
    }
  }

  return issues
}

export function validateGateConfigDraftInput(input: unknown): ValidationResult<void> {
  const issues = collectGateConfigPayloadIssues(input, VALIDATION_DRAFT_MODE)

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, value: undefined }
}

export function validateGateConfigSerializedInput(input: unknown): ValidationResult<void> {
  const issues = collectGateConfigPayloadIssues(input, VALIDATION_SERIALIZED_MODE)

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, value: undefined }
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

  const limits = getDimensionLimits(gateType)

  return {
    version: DEFAULT_CONFIG_VERSION,
    gateType,
    style: isGateStyle(input.style) ? input.style : preset.style,
    widthMm:
      widthMm === null
        ? preset.dimensions.widthMm
        : clamp(widthMm, limits.minWidthMm, limits.maxWidthMm),
    heightMm:
      heightMm === null
        ? preset.dimensions.heightMm
        : clamp(heightMm, limits.minHeightMm, limits.maxHeightMm),
    motorised: typeof input.motorised === 'boolean' ? input.motorised : preset.motorised,
    finish: isFinishCode(input.finish) ? input.finish : DEFAULT_FINISH,
    siteSurveyRequested: typeof input.siteSurveyRequested === 'boolean' ? input.siteSurveyRequested : DEFAULT_SITE_SURVEY_REQUESTED,
    posts: normalizeGatePosts(input.posts),
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

  if (typeof config.siteSurveyRequested !== 'boolean') {
    issues.push({
      field: 'siteSurveyRequested',
      code: 'invalid_site_survey_requested',
      message: 'Site survey request flag must be a boolean.',
    })
  }

  const limits = isGateType(config.gateType) ? getDimensionLimits(config.gateType) : GLOBAL_DIMENSION_LIMITS

  if (!Number.isInteger(config.widthMm) || config.widthMm < limits.minWidthMm || config.widthMm > limits.maxWidthMm) {
    issues.push({
      field: 'widthMm',
      code: 'invalid_width',
      message: `Width must be between ${limits.minWidthMm}mm and ${limits.maxWidthMm}mm.`,
    })
  }

  if (!Number.isInteger(config.heightMm) || config.heightMm < limits.minHeightMm || config.heightMm > limits.maxHeightMm) {
    issues.push({
      field: 'heightMm',
      code: 'invalid_height',
      message: `Height must be between ${limits.minHeightMm}mm and ${limits.maxHeightMm}mm.`,
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
      } else if (SINGLE_INSTANCE_OPTION_KEYS.includes(option.key) && option.quantity > 1) {
        issues.push({
          field: `options.${option.key}.quantity`,
          code: 'option_quantity_not_applicable',
          message: 'This option is a single flat add-on; quantity above 1 is not supported.',
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
      } else if (panel.lengthMm < MIN_FENCE_PANEL_LENGTH_MM || panel.lengthMm > MAX_FENCE_PANEL_LENGTH_MM) {
        issues.push({
          field: `fencePanels.panels[${index}].lengthMm`,
          code: 'invalid_fence_panel_length_range',
          message: `Fence panel length must be between ${MIN_FENCE_PANEL_LENGTH_MM}mm and ${MAX_FENCE_PANEL_LENGTH_MM}mm.`,
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

  if (config.version !== DEFAULT_CONFIG_VERSION) {
    issues.push({
      field: 'version',
      code: 'invalid_version',
      message: `Config version must be ${DEFAULT_CONFIG_VERSION}.`,
    })
  }

  issues.push(...collectCompatibilityIssues(config))
  issues.push(...collectGeometryIssues(config))
  issues.push(...collectVariantCatalogIssues(config))

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, value: config }
}
