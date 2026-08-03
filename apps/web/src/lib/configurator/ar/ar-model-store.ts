/**
 * Ephemeral in-memory AR model store (Phase A).
 * Coolify single-instance OK; replace with S3 + ar_model_key for multi-node.
 */

export type StoredArModel = {
  id: string
  format: 'glb' | 'usdz'
  bytes: Buffer
  contentType: string
  createdAt: number
}

const TTL_MS = 15 * 60 * 1000
const store = new Map<string, StoredArModel>()

function prune() {
  const now = Date.now()
  Array.from(store.entries()).forEach(([id, entry]) => {
    if (now - entry.createdAt > TTL_MS) store.delete(id)
  })
}

export function putArModel(format: 'glb' | 'usdz', bytes: Uint8Array): StoredArModel {
  prune()
  const id = crypto.randomUUID()
  const entry: StoredArModel = {
    id,
    format,
    bytes: Buffer.from(bytes),
    contentType: format === 'glb' ? 'model/gltf-binary' : 'model/vnd.usdz+zip',
    createdAt: Date.now(),
  }
  store.set(id, entry)
  return entry
}

export function getArModel(id: string): StoredArModel | null {
  prune()
  const entry = store.get(id)
  if (!entry) return null
  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(id)
    return null
  }
  return entry
}
