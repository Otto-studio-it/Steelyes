/**
 * Durable AR model store for Coolify single-instance deploys.
 * Memory cache + filesystem under os.tmpdir() so models survive process
 * restarts within the TTL window. Multi-node → replace with S3 + DB key.
 */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { AR_MODEL_TTL_SECONDS, type ArModelFormat } from '@/lib/configurator/ar/ar-handoff'

export type StoredArModel = {
  id: string
  format: ArModelFormat
  bytes: Buffer
  contentType: string
  createdAt: number
  expiresAt: number
}

type StoredArModelMeta = Omit<StoredArModel, 'bytes'>

const TTL_MS = AR_MODEL_TTL_SECONDS * 1000
const memory = new Map<string, StoredArModel>()

function storeDir(): string {
  const dir = process.env.AR_MODEL_STORE_DIR?.trim() || join(tmpdir(), 'steelyes-ar-models')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

function metaPath(id: string): string {
  return join(storeDir(), `${id}.json`)
}

function binPath(id: string, format: ArModelFormat): string {
  return join(storeDir(), `${id}.${format}`)
}

function pruneMemory() {
  const now = Date.now()
  Array.from(memory.entries()).forEach(([id, entry]) => {
    if (now >= entry.expiresAt) memory.delete(id)
  })
}

function removeDisk(id: string, format?: ArModelFormat) {
  try {
    unlinkSync(metaPath(id))
  } catch {
    /* missing ok */
  }
  if (format) {
    try {
      unlinkSync(binPath(id, format))
    } catch {
      /* missing ok */
    }
  } else {
    for (const ext of ['glb', 'usdz'] as const) {
      try {
        unlinkSync(binPath(id, ext))
      } catch {
        /* missing ok */
      }
    }
  }
}

function readFromDisk(id: string): StoredArModel | null {
  try {
    const raw = readFileSync(metaPath(id), 'utf8')
    const meta = JSON.parse(raw) as StoredArModelMeta
    if (!meta?.id || !meta.format || !meta.expiresAt) return null
    if (Date.now() >= meta.expiresAt) {
      removeDisk(id, meta.format)
      return null
    }
    const bytes = readFileSync(binPath(id, meta.format))
    const entry: StoredArModel = { ...meta, bytes }
    memory.set(id, entry)
    return entry
  } catch {
    return null
  }
}

function writeToDisk(entry: StoredArModel) {
  const meta: StoredArModelMeta = {
    id: entry.id,
    format: entry.format,
    contentType: entry.contentType,
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt,
  }
  writeFileSync(metaPath(entry.id), JSON.stringify(meta))
  writeFileSync(binPath(entry.id, entry.format), entry.bytes)
}

export function putArModel(format: ArModelFormat, bytes: Uint8Array): StoredArModel {
  pruneMemory()
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
  memory.set(id, entry)
  try {
    writeToDisk(entry)
  } catch {
    // Memory still serves this process; disk is best-effort for restarts.
  }
  return entry
}

export function getArModel(id: string): StoredArModel | null {
  pruneMemory()
  const cached = memory.get(id)
  if (cached) {
    if (Date.now() >= cached.expiresAt) {
      memory.delete(id)
      removeDisk(id, cached.format)
      return null
    }
    return cached
  }
  return readFromDisk(id)
}

/** Test helper — clear memory + known disk entries for this process. */
export function clearArModelStoreForTests(): void {
  for (const [id, entry] of Array.from(memory.entries())) {
    removeDisk(id, entry.format)
  }
  memory.clear()
}

export function arModelStoreSizeForTests(): number {
  pruneMemory()
  return memory.size
}

export function arModelStoreBackendLabel(): 'memory+disk' {
  return 'memory+disk'
}
