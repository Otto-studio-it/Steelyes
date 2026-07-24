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
    expect(getFinishDefinition('matte_black').label).toBe('Matte black')
    expect(getFinishDefinition('bronze').label).toBe('Bronze')
    expect(listFinishDefinitions()).toHaveLength(FINISH_CODES.length)
  })

  it('uses darker strokes for pearl white contrast', () => {
    const tokens = getFinishDefinition('pearl_white').schematic
    expect(getFinishStrokeColor(tokens, 'pearl_white')).toBe(tokens.label)
    expect(getFinishStrokeColor(tokens, 'pearl_white')).not.toBe(tokens.frame)
  })

  it('keeps schematic tokens distinct per finish', () => {
    const matte = getFinishDefinition('matte_black').schematic
    const bronze = getFinishDefinition('bronze').schematic
    expect(matte.frame).not.toBe(bronze.frame)
    expect(matte.infill).not.toBe(bronze.infill)
  })
})
