import type { GateConfig, GateMeshFidelity } from '@steelyes/gate-engine'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js'

import { buildGateThreeGroup } from '@/lib/configurator/ar/build-gate-three-group'

export type GateArExportResult = {
  glbBlob: Blob
  usdzBlob: Blob
  glbUrl: string
  usdzUrl: string
  fidelity: GateMeshFidelity
  notes: string[]
  revoke: () => void
}

function arrayBufferToBlob(buffer: ArrayBuffer, type: string): Blob {
  return new Blob([buffer], { type })
}

async function exportGlb(group: import('three').Object3D): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(group, {
    binary: true,
    onlyVisible: true,
  })
  if (result instanceof ArrayBuffer) return result
  const json = JSON.stringify(result)
  return new TextEncoder().encode(json).buffer
}

async function exportUsdz(group: import('three').Object3D): Promise<ArrayBuffer> {
  const exporter = new USDZExporter()
  const data = await exporter.parseAsync(group)
  if (data instanceof ArrayBuffer) return data
  const bytes = data as Uint8Array
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

/** Client-side GLB + USDZ from the same GateConfig mesh (real mm → metres). */
export async function exportGateArModel(config: GateConfig): Promise<GateArExportResult> {
  const { group, plan, dispose } = buildGateThreeGroup(config)
  try {
    const [glbBuffer, usdzBuffer] = await Promise.all([exportGlb(group), exportUsdz(group)])
    const glbBlob = arrayBufferToBlob(glbBuffer, 'model/gltf-binary')
    const usdzBlob = arrayBufferToBlob(usdzBuffer, 'model/vnd.usdz+zip')
    const glbUrl = URL.createObjectURL(glbBlob)
    const usdzUrl = URL.createObjectURL(usdzBlob)
    return {
      glbBlob,
      usdzBlob,
      glbUrl,
      usdzUrl,
      fidelity: plan.fidelity,
      notes: plan.notes,
      revoke: () => {
        URL.revokeObjectURL(glbUrl)
        URL.revokeObjectURL(usdzUrl)
      },
    }
  } finally {
    dispose()
  }
}
