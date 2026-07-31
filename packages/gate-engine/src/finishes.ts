import { FINISH_CODES, type FinishCode, type GateConfig } from './types'

export type FinishSchematicTokens = {
  frame: string
  infill: string
  accent: string
  panel: string
  label: string
  strokeMuted: string
}

export type FinishMaterialTokens = {
  colorHex: string
  metalness: number
  roughness: number
}

export type FinishDefinition = {
  code: FinishCode
  label: string
  provisional: boolean
  schematic: FinishSchematicTokens
  material: FinishMaterialTokens
}

/**
 * Standard colours from the client (black satin/matt/gloss + RAL 7016), plus
 * "Other RAL" with optional customer hex (CA-03). Standard powder coat is
 * included in FROM (intake). other_ral = "+ extra charge — powder coating".
 */
export const FINISH_CATALOG: Record<FinishCode, FinishDefinition> = {
  black_satin: {
    code: 'black_satin',
    label: 'Black satin',
    provisional: false,
    schematic: {
      frame: '#1C1C1E',
      infill: '#2C2C2E',
      accent: '#3F3F41',
      panel: '#FFFFFF',
      label: '#2C2C2E',
      strokeMuted: '#8A8A8A',
    },
    material: {
      colorHex: '#1C1C1E',
      metalness: 0.8,
      roughness: 0.45,
    },
  },
  black_matt: {
    code: 'black_matt',
    label: 'Black matt',
    provisional: false,
    schematic: {
      frame: '#1A1A1A',
      infill: '#242424',
      accent: '#383838',
      panel: '#FFFFFF',
      label: '#242424',
      strokeMuted: '#8A8A8A',
    },
    material: {
      colorHex: '#1A1A1A',
      metalness: 0.65,
      roughness: 0.8,
    },
  },
  black_gloss: {
    code: 'black_gloss',
    label: 'Black gloss',
    provisional: false,
    schematic: {
      frame: '#0E0E10',
      infill: '#1B1B1E',
      accent: '#2E2E33',
      panel: '#FFFFFF',
      label: '#1B1B1E',
      strokeMuted: '#7F7F85',
    },
    material: {
      colorHex: '#0E0E10',
      metalness: 0.9,
      roughness: 0.12,
    },
  },
  anthracite_ral7016: {
    code: 'anthracite_ral7016',
    label: 'Anthracite RAL 7016',
    provisional: false,
    schematic: {
      frame: '#383E42',
      infill: '#464D52',
      accent: '#2C3134',
      panel: '#F4F5F6',
      label: '#383E42',
      strokeMuted: '#8B9298',
    },
    material: {
      colorHex: '#383E42',
      metalness: 0.75,
      roughness: 0.4,
    },
  },
  other_ral: {
    code: 'other_ral',
    label: 'Custom colour',
    provisional: true,
    schematic: {
      frame: '#9A9EA3',
      infill: '#B4B8BC',
      accent: '#7E8388',
      panel: '#F6F6F7',
      label: '#5C6166',
      strokeMuted: '#A6ABB0',
    },
    material: {
      colorHex: '#9A9EA3',
      metalness: 0.6,
      roughness: 0.5,
    },
  },
}

const HEX_RE = /^#([0-9A-Fa-f]{6})$/

/** Normalize user input to `#RRGGBB` or null if invalid. */
export function normalizeFinishHex(input: string | null | undefined): string | null {
  if (!input) return null
  const trimmed = input.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (!HEX_RE.test(withHash)) return null
  return withHash.toUpperCase()
}

export function isValidFinishHex(input: string | null | undefined): boolean {
  return normalizeFinishHex(input) !== null
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const raw = hex.slice(1)
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

function mixToward(hex: string, toward: number, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(
    r + (toward - r) * amount,
    g + (toward - g) * amount,
    b + (toward - b) * amount,
  )
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Build schematic + material tokens from a custom powder-coat hex. */
export function buildCustomFinishTokens(hexInput: string): {
  schematic: FinishSchematicTokens
  material: FinishMaterialTokens
} | null {
  const hex = normalizeFinishHex(hexInput)
  if (!hex) return null

  const light = relativeLuminance(hex) > 0.45
  const infill = mixToward(hex, light ? 0 : 255, 0.12)
  const accent = mixToward(hex, light ? 0 : 255, 0.22)
  const label = light ? mixToward(hex, 0, 0.55) : mixToward(hex, 255, 0.35)
  const strokeMuted = mixToward(hex, 128, 0.45)

  return {
    schematic: {
      frame: hex,
      infill,
      accent,
      panel: light ? '#1A1A1A' : '#FFFFFF',
      label,
      strokeMuted,
    },
    material: {
      colorHex: hex,
      metalness: 0.7,
      roughness: 0.4,
    },
  }
}

export function getFinishDefinition(code: FinishCode): FinishDefinition {
  return FINISH_CATALOG[code]
}

/**
 * Resolve finish for rendering/UI — applies `customFinishHex` when finish is `other_ral`.
 */
export function resolveFinishDefinition(
  config: Pick<GateConfig, 'finish' | 'customFinishHex'>,
): FinishDefinition {
  const base = getFinishDefinition(config.finish)
  if (config.finish !== 'other_ral') {
    return base
  }

  const custom = config.customFinishHex ? buildCustomFinishTokens(config.customFinishHex) : null
  if (!custom) {
    return base
  }

  const hex = normalizeFinishHex(config.customFinishHex)!
  return {
    ...base,
    label: `Custom ${hex}`,
    provisional: true,
    schematic: custom.schematic,
    material: custom.material,
  }
}

export function listFinishDefinitions(): FinishDefinition[] {
  return FINISH_CODES.map((code) => FINISH_CATALOG[code])
}

/** Primary stroke color — light finishes need darker outlines for contrast. */
export function getFinishStrokeColor(tokens: FinishSchematicTokens, code: FinishCode): string {
  if (code === 'other_ral') {
    return relativeLuminance(tokens.frame) > 0.45 ? tokens.label : tokens.frame
  }
  return tokens.frame
}
