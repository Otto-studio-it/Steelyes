import { describe, expect, it } from 'vitest'

import { createTtlLru } from './ttl-lru'

describe('createTtlLru', () => {
  it('evicts the least recently used entry', () => {
    const cache = createTtlLru<number>({ maxEntries: 2 })
    cache.set('a', 1)
    cache.set('b', 2)
    expect(cache.get('a')).toBe(1) // touch a → b is now the oldest
    cache.set('c', 3)
    expect(cache.get('b')).toBeNull()
    expect(cache.get('a')).toBe(1)
    expect(cache.size).toBe(2)
  })

  it('expires entries after the TTL', () => {
    const cache = createTtlLru<string>({ maxEntries: 5, ttlMs: 1000 })
    cache.set('k', 'v', 0)
    expect(cache.get('k', 999)).toBe('v')
    expect(cache.get('k', 1000)).toBeNull()
  })
})
