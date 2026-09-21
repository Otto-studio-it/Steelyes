import { createGateConfig, createGatePreset, GATE_TYPES } from '@steelyes/gate-engine'
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js'
import { describe, expect, it } from 'vitest'

import { exportGateArModel } from './export-gate-ar-model'

function glbJson(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const jsonLength = view.getUint32(12, true)
  return JSON.parse(new TextDecoder().decode(bytes.subarray(20, 20 + jsonLength)))
}

describe('exportGateArModel (server-side)', () => {
  it('exports a light GLB for every gate type — one mesh and material per role', async () => {
    for (const gateType of GATE_TYPES) {
      const { bytes } = await exportGateArModel(createGateConfig(createGatePreset(gateType)), 'glb')
      expect(new TextDecoder().decode(bytes.subarray(0, 4)), gateType).toBe('glTF')

      const json = glbJson(bytes)
      expect(json.meshes.length, `${gateType} meshes`).toBeLessThanOrEqual(6)
      expect(json.materials.length, `${gateType} materials`).toBeLessThanOrEqual(6)
      expect(bytes.byteLength, `${gateType} size`).toBeLessThan(1024 * 1024)
    }
  })

  it('exports a Quick Look USDZ in metres, Y-up, fully opaque', async () => {
    const { bytes } = await exportGateArModel(createGateConfig(createGatePreset('double_swing')), 'usdz')
    expect(bytes[0]).toBe(0x50)
    expect(bytes[1]).toBe(0x4b)

    const usda = strFromU8(unzipSync(bytes)['model.usda']!)
    expect(usda).toContain('metersPerUnit = 1')
    expect(usda).toContain('upAxis = "Y"')
    expect((usda.match(/def Material /g) ?? []).length).toBeLessThanOrEqual(6)
    expect(usda).not.toMatch(/inputs:opacity = 0\./)
  })

  it('keeps the floor snap in the USDZ (the exporter drops the transform of its root object)', async () => {
    // Tracked sliding has a ground track 2 mm below the datum, so the gate is lifted by 0.002 m.
    const { bytes } = await exportGateArModel(createGateConfig(createGatePreset('tracked_sliding')), 'usdz')
    const usda = strFromU8(unzipSync(bytes)['model.usda']!)
    const lift = /def Xform "steelyesgatetracked_sliding"[\s\S]*?matrix4d xformOp:transform = \([^\n]*\(0, ([\d.e-]+), 0, 1\) \)/.exec(usda)
    expect(lift, 'gate group transform').not.toBeNull()
    expect(Number(lift![1])).toBeCloseTo(0.002, 5)
  })
})
