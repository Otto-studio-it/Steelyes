import { describe, expect, it } from 'vitest'

import {
  FINISH_CATALOG,
  FINISH_CODES,
  getFinishDefinition,
  getFinishStrokeColor,
  listFinishDefinitions,
  normalizeFinishHex,
  resolveFinishDefinition,
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

  it('uses darker strokes for light custom other_ral hex', () => {
    const light = resolveFinishDefinition({ finish: 'other_ral', customFinishHex: '#E8E4DC' })
    expect(getFinishStrokeColor(light.schematic, 'other_ral')).toBe(light.schematic.label)
    expect(getFinishStrokeColor(light.schematic, 'other_ral')).not.toBe(light.schematic.frame)
  })

  it('applies custom hex to other_ral preview tokens', () => {
    const resolved = resolveFinishDefinition({ finish: 'other_ral', customFinishHex: '#9E000C' })
    expect(normalizeFinishHex('9e000c')).toBe('#9E000C')
    expect(resolved.material.colorHex).toBe('#9E000C')
    expect(resolved.schematic.frame).toBe('#9E000C')
    expect(resolved.label).toContain('#9E000C')
  })

  it('keeps schematic tokens distinct per finish', () => {
    const matte = getFinishDefinition('black_satin').schematic
    const bronze = getFinishDefinition('black_matt').schematic
    expect(matte.frame).not.toBe(bronze.frame)
    expect(matte.infill).not.toBe(bronze.infill)
  })
})
