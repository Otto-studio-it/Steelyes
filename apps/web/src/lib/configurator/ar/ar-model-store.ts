/**
 * Ephemeral in-memory AR model store (Phase A / Phase 2 harden).
 * Coolify single-instance OK; replace with S3 + ar_model_key for multi-node.
 */

import { AR_MODEL_TTL_SECONDS, type ArModelFormat } from '@/lib/configurator/ar/ar-handoff'

export type StoredArModel = {
  id: string
  format: ArModelFormat
  bytes: Buffer
  contentType: string
  createdAt: number
  expiresAt: number
}

const TTL_MS = AR_MODEL_TTL_SECONDS * 1000
const store = new Map<string, StoredArModel>()

function prune() {
  const now = Date.now()
  Array.from(store.entries()).forEach(([id, entry]) => {
    if (now >= entry.expiresAt) store.delete(id)
  })
}

export function putArModel(format: ArModelFormat, bytes: Uint8Array): StoredArModel {
  prune()
  const id = crypto.randomUUID()
  const createdAt = Date.now()
  const entry: StoredArModel = {
    id,
    format,
    bytes: Buffer.from(bytes),
    contentType: format === 'glb' ? 'model/gltf-binary' : 'model/vnd.usdz+zip',
    createdAt,
    expiresAt: createdAt + TTL_MS,
  }
  store.set(id, entry)
  return entry
}

export function getArModel(id: string): StoredArModel | null {
  prune()
  const entry = store.get(id)
  if (!entry) return null
  if (Date.now() >= entry.expiresAt) {
    store.delete(id)
    return null
  }
  return entry
}

/** Test helper — clear store between unit checks. */
export function clearArModelStoreForTests(): void {
  store.clear()
}

export function arModelStoreSizeForTests(): number {
  prune()
  return store.size
}
