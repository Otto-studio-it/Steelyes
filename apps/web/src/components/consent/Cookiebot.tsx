import Script from 'next/script'

function cookiebotId(): string | null {
  const id = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim()
  return id || null
}

/**
 * Banner / CMP script — Cookiebot requires this as the first script in <head>.
 * Set NEXT_PUBLIC_COOKIEBOT_ID to the Domain Group ID from the Cookiebot dashboard.
 *
 * Equivalent to:
 * <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
 *   data-cbid="…" data-blockingmode="auto" type="text/javascript"></script>
 */
export function CookiebotScript() {
  const id = cookiebotId()
  if (!id) return null

  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      strategy="beforeInteractive"
      data-cbid={id}
      data-blockingmode="auto"
      type="text/javascript"
    />
  )
}

export function isCookiebotEnabled(): boolean {
  return Boolean(cookiebotId())
}
