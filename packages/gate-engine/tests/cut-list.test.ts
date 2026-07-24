import { describe, expect, it } from 'vitest'

import { buildGateCutList, createGateConfig, createGatePreset, serializeCutListCsv } from '../src/index'

describe('gate cut list', () => {
  it('builds schematic cut lines for double swing Victorian gates', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const cutList = buildGateCutList(config)

    expect(cutList.lines.length).toBeGreaterThan(0)
    expect(cutList.lines.some((line) => line.role === 'rail')).toBe(true)
    expect(cutList.lines.some((line) => line.role === 'picket')).toBe(true)
  })

  it('serializes cut list to CSV', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const csv = serializeCutListCsv(buildGateCutList(config))

    expect(csv).toContain('id,role,profile,length_mm,quantity,note')
    expect(csv).toContain('horizontal-rail-1')
  })
})
