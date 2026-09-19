import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstile } from './turnstile'

describe('verifyTurnstile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.TURNSTILE_SECRET_KEY
  })

  it('passes through when no secret is configured', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    await expect(verifyTurnstile('')).resolves.toEqual({ ok: true })
  })

  it('rejects a missing token when a secret is set', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
    await expect(verifyTurnstile('')).resolves.toEqual({ ok: false, reason: 'missing_token' })
  })

  it('treats Cloudflare errors as unavailable instead of a missing check', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }),
    )

    await expect(verifyTurnstile('token')).resolves.toEqual({ ok: false, reason: 'unavailable' })
  })

  it('treats a network failure as unavailable', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ENOTFOUND')))

    await expect(verifyTurnstile('token')).resolves.toEqual({ ok: false, reason: 'unavailable' })
  })
})
