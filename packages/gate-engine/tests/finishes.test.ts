import { describe, expect, it } from 'vitest'

import {
  FINISH_CATALOG,
  FINISH_CODES,
  getFinishDefinition,
  getFinishStrokeColor,
  listFinishDefinitions,
} from '../src/index'

describe('gate-engine finishes', () => {
  it('defines every finish code in the catalog', () => {
    for (const code of FINISH_CODES) {
      expect(FINISH_CATALOG[code]).toBeDefined()
      expect(FINISH_CATALOG[code].code).toBe(code)
    }
  })

  it('returns stable labels for UI consumption', () => {
    expect(getFinishDefinition('black_satin').label).toBe('Black satin')
    expect(getFinishDefinition('black_matt').label).toBe('Black matt')
    expect(listFinishDefinitions()).toHaveLength(FINISH_CODES.length)
  })

  it('uses darker strokes for the light Other RAL swatch contrast', () => {
    const tokens = getFinishDefinition('other_ral').schematic
    expect(getFinishStrokeColor(tokens, 'other_ral')).toBe(tokens.label)
    expect(getFinishStrokeColor(tokens, 'other_ral')).not.toBe(tokens.frame)
  })

  it('keeps schematic tokens distinct per finish', () => {
    const matte = getFinishDefinition('black_satin').schematic
    const bronze = getFinishDefinition('black_matt').schematic
    expect(matte.frame).not.toBe(bronze.frame)
    expect(matte.infill).not.toBe(bronze.infill)
  })
})
