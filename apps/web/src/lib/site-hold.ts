/** Temporary public site pause (unpaid / ops hold). Toggle with SITE_HOLD=true. */

export const SITE_HOLD_COOKIE = 'steelyes_hold_bypass'
export const SITE_HOLD_QUERY = 'hold_bypass'
/** 7 days — Google treats 503 + Retry-After as temporary. */
export const SITE_HOLD_RETRY_AFTER_SECONDS = 60 * 60 * 24 * 7

export function isSiteHoldEnabled(): boolean {
  return process.env.SITE_HOLD === 'true'
}

export function getSiteHoldBypassToken(): string | undefined {
  const token = process.env.SITE_HOLD_BYPASS_TOKEN?.trim()
  return token || undefined
}

export function getSiteHoldContactEmail(): string | undefined {
  const email = process.env.SITE_HOLD_CONTACT_EMAIL?.trim()
  return email || undefined
}
