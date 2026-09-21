import { afterEach, describe, expect, it } from 'vitest'

import { checkRateLimit, clientKeyFromHeaders, resetRateLimitsForTests } from './rate-limit'

const rule = { name: 'test', limit: 2, windowMs: 1000 }

describe('checkRateLimit', () => {
  afterEach(() => resetRateLimitsForTests())

  it('allows up to the limit, then blocks with a retry hint', () => {
    expect(checkRateLimit(rule, 'a', 0)).toEqual({ ok: true })
    expect(checkRateLimit(rule, 'a', 100)).toEqual({ ok: true })
    expect(checkRateLimit(rule, 'a', 200)).toEqual({ ok: false, retryAfterSeconds: 1 })
  })

  it('slides the window and isolates keys', () => {
    checkRateLimit(rule, 'a', 0)
    checkRateLimit(rule, 'a', 100)
    expect(checkRateLimit(rule, 'b', 150)).toEqual({ ok: true })
    expect(checkRateLimit(rule, 'a', 1050)).toEqual({ ok: true })
  })

  it('does not extend the block when blocked requests keep arriving', () => {
    checkRateLimit(rule, 'a', 0)
    checkRateLimit(rule, 'a', 0)
    for (let t = 100; t < 1000; t += 100) checkRateLimit(rule, 'a', t)
    expect(checkRateLimit(rule, 'a', 1000)).toEqual({ ok: true })
  })
})

describe('clientKeyFromHeaders', () => {
  it('prefers Cloudflare, then the first forwarded hop', () => {
    expect(clientKeyFromHeaders(new Headers({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' }))).toBe('1.1.1.1')
    expect(clientKeyFromHeaders(new Headers({ 'x-forwarded-for': '2.2.2.2, 10.0.0.1' }))).toBe('2.2.2.2')
    expect(clientKeyFromHeaders(new Headers())).toBe('unknown')
  })
})
