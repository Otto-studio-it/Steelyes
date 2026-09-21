import type { GateConfig, GateMeshFidelity } from '@steelyes/gate-engine'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js'

import type { ArModelFormat } from '@/lib/configurator/ar/ar-handoff'
import { buildGateThreeGroup } from '@/lib/configurator/ar/build-gate-three-group'

export type GateArModel = {
  bytes: Uint8Array
  fidelity: GateMeshFidelity
}

/**
 * GLTFExporter packs the binary chunk through `FileReader`, which Node does not have.
 * Minimal shim (readAsArrayBuffer only — the gate model has no textures, so nothing else is hit).
 */
function ensureFileReader() {
  if (typeof globalThis.FileReader !== 'undefined') return

  class NodeFileReader {
    result: ArrayBuffer | null = null
    onloadend: (() => void) | null = null

    readAsArrayBuffer(blob: Blob) {
      void blob.arrayBuffer().then((buffer) => {
        this.result = buffer
        this.onloadend?.()
      })
    }
  }

  ;(globalThis as { FileReader?: unknown }).FileReader = NodeFileReader
}

/**
 * Export one AR model from a GateConfig (real mm → metres). Runs on the server: the model is
 * derived from the saved configuration, so there is no client upload to trust or store.
 */
export async function exportGateArModel(config: GateConfig, format: ArModelFormat): Promise<GateArModel> {
  const { root, plan, dispose } = buildGateThreeGroup(config)
  try {
    if (format === 'usdz') {
      const data = await new USDZExporter().parseAsync(root)
      return { bytes: data instanceof Uint8Array ? data : new Uint8Array(data), fidelity: plan.fidelity }
    }

    ensureFileReader()
    const result = await new GLTFExporter().parseAsync(root, { binary: true, onlyVisible: true })
    if (!(result instanceof ArrayBuffer)) {
      throw new Error('GLTFExporter did not return a binary GLB')
    }
    return { bytes: new Uint8Array(result), fidelity: plan.fidelity }
  } finally {
    dispose()
  }
}
