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

export const FINISH_CATALOG: Record<FinishCode, FinishDefinition> = {
  matte_black: {
    code: 'matte_black',
    label: 'Matte black',
    provisional: true,
    schematic: {
      frame: '#1A1A1A',
      infill: '#2A2A2A',
      accent: '#3D3D3D',
      panel: '#FFFFFF',
      label: '#2A2A2A',
      strokeMuted: '#8A8A8A',
    },
    material: {
      colorHex: '#1A1A1A',
      metalness: 0.85,
      roughness: 0.45,
    },
  },
  zinc_grey: {
    code: 'zinc_grey',
    label: 'Zinc grey',
    provisional: true,
    schematic: {
      frame: '#8A9199',
      infill: '#A3A9AF',
      accent: '#6E757D',
      panel: '#F4F5F6',
      label: '#5C636A',
      strokeMuted: '#9AA1A8',
    },
    material: {
      colorHex: '#8A9199',
      metalness: 0.75,
      roughness: 0.35,
    },
  },
  bronze: {
    code: 'bronze',
    label: 'Bronze',
    provisional: true,
    schematic: {
      frame: '#8B6914',
      infill: '#A67C2D',
      accent: '#6B4F0F',
      panel: '#F7F0E4',
      label: '#7A5A12',
      strokeMuted: '#A6894A',
    },
    material: {
      colorHex: '#8B6914',
      metalness: 0.7,
      roughness: 0.4,
    },
  },
  pearl_white: {
    code: 'pearl_white',
    label: 'Pearl white',
    provisional: true,
    schematic: {
      frame: '#E8E4DD',
      infill: '#F5F3F0',
      accent: '#C9C2B8',
      panel: '#FFFFFF',
      label: '#4A4540',
      strokeMuted: '#8A807B',
    },
    material: {
      colorHex: '#E8E4DD',
      metalness: 0.35,
      roughness: 0.55,
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
  return code === 'pearl_white' ? tokens.label : tokens.frame
}
