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
  it('cuts stiles to the gate height and rails to one leaf, not the whole opening', () => {
    const config = { ...createGateConfig(createGatePreset('double_swing')), widthMm: 3000, heightMm: 1800 }
    const line = (id: string) => buildGateCutList(config).lines.find((entry) => entry.id === id)!

    // Stiles are vertical: gate height, 2 per leaf.
    expect(line('leaf-stiles').lengthMm).toBe(1800)
    expect(line('leaf-stiles').quantity).toBe(4)

    // One leaf = 1500 − 3 (half the meeting gap); horizontals sit between two 40 mm stiles.
    expect(line('horizontal-rail-1').lengthMm).toBe(1417)
    expect(line('horizontal-rail-1').quantity).toBe(2)
    expect(line('leaf-top-member').lengthMm).toBe(1417)

    // Steel for one rail position never exceeds the opening (it used to be ~2× the width).
    expect(line('horizontal-rail-1').lengthMm * line('horizontal-rail-1').quantity).toBeLessThan(3000)
  })

  it('counts upper pickets per leaf × leaves and labels them as picket tube', () => {
    const config = { ...createGateConfig(createGatePreset('double_swing')), widthMm: 3000, heightMm: 1800 }
    const upper = buildGateCutList(config).lines.find((entry) => entry.id === 'upper-pickets')!

    // 1500 mm leaf / 100 mm spacing = 15 per leaf → 30 (was 16).
    expect(upper.quantity).toBe(30)
    expect(upper.profile).toBe('20mm round')
  })

  it('doubles stiles and horizontals for bifold panels', () => {
    const config = createGateConfig(createGatePreset('bifolding_double_swing'))
    const stiles = buildGateCutList(config).lines.find((entry) => entry.id === 'leaf-stiles')!
    expect(stiles.quantity).toBe(8)
  })

  it('gives a cantilever a counterbalance tail and no ground track (CA-05)', () => {
    const config = { ...createGateConfig(createGatePreset('cantilever_sliding')), widthMm: 4000 }
    const lines = buildGateCutList(config).lines

    expect(lines.some((entry) => entry.id === 'track-rail')).toBe(false)
    expect(lines.find((entry) => entry.id === 'counterbalance-tail')?.lengthMm).toBe(1333)

    const tracked = buildGateCutList(createGateConfig(createGatePreset('tracked_sliding'))).lines
    expect(tracked.some((entry) => entry.id === 'track-rail')).toBe(true)
  })
})
