import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstile } from './turnstile'

describe('verifyTurnstile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    delete process.env.TURNSTILE_SECRET_KEY
  })

  it('passes through unverified when no secret is configured outside production', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    await expect(verifyTurnstile('')).resolves.toEqual({ ok: true, verified: false })
  })

  it('fails closed in production when no secret is configured', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubEnv('NODE_ENV', 'production')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(verifyTurnstile('token')).resolves.toEqual({ ok: false, reason: 'unavailable' })
  })

  it('honours the explicit production opt-out but records the check as unverified', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('TURNSTILE_ALLOW_UNVERIFIED', 'true')
    await expect(verifyTurnstile('')).resolves.toEqual({ ok: true, verified: false })
  })

  it('marks a successful Cloudflare check as verified', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }))
    await expect(verifyTurnstile('token')).resolves.toEqual({ ok: true, verified: true })
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
