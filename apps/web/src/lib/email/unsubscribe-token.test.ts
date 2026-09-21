import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildUnsubscribePath, signUnsubscribeToken, verifyUnsubscribeToken } from './unsubscribe-token'

describe('unsubscribe token', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('round-trips for the same capture and rejects others', () => {
    vi.stubEnv('CRON_SECRET', 'test-secret')
    const token = signUnsubscribeToken('capture-1')!
    expect(verifyUnsubscribeToken('capture-1', token)).toBe(true)
    expect(verifyUnsubscribeToken('capture-2', token)).toBe(false)
    expect(verifyUnsubscribeToken('capture-1', 'forged')).toBe(false)
    expect(buildUnsubscribePath('capture-1')).toContain('/api/unsubscribe?c=capture-1&t=')
  })

  it('produces no link without a secret', () => {
    vi.stubEnv('CRON_SECRET', '')
    vi.stubEnv('UNSUBSCRIBE_SECRET', '')
    expect(buildUnsubscribePath('capture-1')).toBeNull()
    expect(verifyUnsubscribeToken('capture-1', 'anything')).toBe(false)
  })
})
