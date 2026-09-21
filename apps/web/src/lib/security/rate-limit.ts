/**
 * In-memory sliding-window rate limiter for the single-instance Coolify deploy.
 * Multi-node → replace the Map with Redis / Postgres; the call sites stay the same.
 */

export type RateLimitRule = {
  /** Bucket namespace, e.g. `quote` — combined with the caller key. */
  name: string
  limit: number
  windowMs: number
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

const MAX_TRACKED_KEYS = 20_000
const hits = new Map<string, number[]>()

function sweep(now: number, windowMs: number) {
  hits.forEach((stamps, key) => {
    if (stamps.length === 0 || now - stamps[stamps.length - 1]! >= windowMs) hits.delete(key)
  })
}

export function checkRateLimit(rule: RateLimitRule, key: string, now: number = Date.now()): RateLimitResult {
  const bucket = `${rule.name}:${key}`
  const recent = (hits.get(bucket) ?? []).filter((stamp) => now - stamp < rule.windowMs)

  if (recent.length >= rule.limit) {
    hits.set(bucket, recent)
    const retryAfterMs = rule.windowMs - (now - recent[0]!)
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
  }

  recent.push(now)
  hits.set(bucket, recent)
  if (hits.size > MAX_TRACKED_KEYS) sweep(now, rule.windowMs)
  return { ok: true }
}

/**
 * Best-effort client address behind Cloudflare → Traefik. Header values are attacker-controlled
 * if the origin is reachable directly, so this throttles abuse; it is not an identity.
 */
export function clientKeyFromHeaders(headers: Pick<Headers, 'get'>): string {
  const candidate =
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0] ??
    headers.get('x-real-ip') ??
    ''
  const trimmed = candidate.trim().slice(0, 64)
  return trimmed || 'unknown'
}

export const RATE_LIMITS = {
  quoteSubmit: { name: 'quote', limit: 5, windowMs: 10 * 60_000 },
  emailDesign: { name: 'email-design', limit: 5, windowMs: 10 * 60_000 },
  /** Per recipient, regardless of sender address — stops mail-bombing one inbox. */
  emailRecipient: { name: 'email-to', limit: 3, windowMs: 60 * 60_000 },
  saveConfiguration: { name: 'save-config', limit: 30, windowMs: 10 * 60_000 },
  quotePdf: { name: 'quote-pdf', limit: 20, windowMs: 10 * 60_000 },
  /** One "View in your space" tap = two uploads (GLB + USDZ). */
  arUpload: { name: 'ar-upload', limit: 20, windowMs: 10 * 60_000 },
} as const satisfies Record<string, RateLimitRule>

export const RATE_LIMIT_MESSAGE = 'Too many requests. Please wait a few minutes and try again.'

export function resetRateLimitsForTests(): void {
  hits.clear()
}
