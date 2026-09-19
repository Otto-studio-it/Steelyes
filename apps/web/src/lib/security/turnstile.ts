import type { TurnstileFailureReason } from '@/lib/configurator/lead-pipeline'

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; reason: TurnstileFailureReason }

const VERIFY_TIMEOUT_MS = 8_000

export async function verifyTurnstile(token: string | null | undefined): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return { ok: true }
  }

  if (!token) {
    return { ok: false, reason: 'missing_token' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      return { ok: false, reason: 'unavailable' }
    }

    const payload = (await response.json()) as { success?: boolean }
    return payload.success === true ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: 'unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

export async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  return (await verifyTurnstile(token)).ok
}
