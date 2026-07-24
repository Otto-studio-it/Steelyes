import { FINISH_CODES, type FinishCode } from './types'

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
 * "Other RAL" where the customer writes the code in the quote notes. The
 * £55+VAT/m² colour uplift is pending confirmation, so all entries stay
 * provisional for pricing purposes.
 */
export const FINISH_CATALOG: Record<FinishCode, FinishDefinition> = {
  black_satin: {
    code: 'black_satin',
    label: 'Black satin',
    provisional: true,
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
    provisional: true,
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
    provisional: true,
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
    provisional: true,
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
    label: 'Other RAL colour',
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

export function getFinishDefinition(code: FinishCode): FinishDefinition {
  return FINISH_CATALOG[code]
}

export function listFinishDefinitions(): FinishDefinition[] {
  return FINISH_CODES.map((code) => FINISH_CATALOG[code])
}

/** Primary stroke color — light finishes need darker outlines for contrast. */
export function getFinishStrokeColor(tokens: FinishSchematicTokens, code: FinishCode): string {
  return code === 'other_ral' ? tokens.label : tokens.frame
}
