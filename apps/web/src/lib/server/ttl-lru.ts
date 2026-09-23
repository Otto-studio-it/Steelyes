/**
 * Tiny in-process LRU with an optional TTL — for expensive, deterministic responses on the
 * single-instance deploy (AR models, quote PDFs). Not shared across processes.
 */
export function createTtlLru<V>(options: { maxEntries: number; ttlMs?: number }) {
  const entries = new Map<string, { value: V; storedAt: number }>()

  return {
    get(key: string, now: number = Date.now()): V | null {
      const hit = entries.get(key)
      if (!hit) return null
      if (options.ttlMs !== undefined && now - hit.storedAt >= options.ttlMs) {
        entries.delete(key)
        return null
      }
      // Map keeps insertion order: re-insert to mark as most recently used.
      entries.delete(key)
      entries.set(key, hit)
      return hit.value
    },
    set(key: string, value: V, now: number = Date.now()): void {
      entries.delete(key)
      entries.set(key, { value, storedAt: now })
      while (entries.size > options.maxEntries) {
        const oldest = entries.keys().next().value
        if (oldest === undefined) break
        entries.delete(oldest)
      }
    },
    get size() {
      return entries.size
    },
  }
}
