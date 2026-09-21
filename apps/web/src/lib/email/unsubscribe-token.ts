import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Stateless unsubscribe links for reminder emails: HMAC of the capture id, keyed with
 * UNSUBSCRIBE_SECRET (falls back to CRON_SECRET — reminders only go out when that is set).
 */
function secret(): string | null {
  return process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || null
}

export function signUnsubscribeToken(captureId: string): string | null {
  const key = secret()
  if (!key) return null
  return createHmac('sha256', key).update(`unsubscribe:${captureId}`).digest('base64url')
}

export function verifyUnsubscribeToken(captureId: string, token: string): boolean {
  const expected = signUnsubscribeToken(captureId)
  if (!expected) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function buildUnsubscribePath(captureId: string): string | null {
  const token = signUnsubscribeToken(captureId)
  if (!token) return null
  return `/api/unsubscribe?c=${encodeURIComponent(captureId)}&t=${encodeURIComponent(token)}`
}
