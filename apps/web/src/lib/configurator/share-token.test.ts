import { describe, expect, it } from 'vitest'
import { createShareToken, isValidShareToken } from './share-token'

describe('createShareToken', () => {
  it('returns a 12-char base64url token accepted by isValidShareToken', () => {
    for (let i = 0; i < 200; i++) {
      const t = createShareToken()
      expect(t).toMatch(/^[A-Za-z0-9_-]{12}$/)
      expect(isValidShareToken(t)).toBe(true)
    }
  })

  it('is random', () => {
    expect(new Set(Array.from({ length: 50 }, createShareToken)).size).toBe(50)
  })
})
