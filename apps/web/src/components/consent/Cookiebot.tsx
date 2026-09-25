function cookiebotId(): string | null {
  const id = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim()
  return id || null
}

/**
 * Banner / CMP script — Cookiebot loads as early as possible in <head>.
 * Using a regular <script> tag (not next/script) for App Router compatibility
 * and to ensure it loads before other scripts per Cookiebot's requirements.
 * Set NEXT_PUBLIC_COOKIEBOT_ID to the Domain Group ID from the Cookiebot dashboard.
 */
export function CookiebotScript() {
  const id = cookiebotId()
  if (!id) return null

  return (
    <script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={id}
      data-blockingmode="auto"
      async
    />
  )
}

export function isCookiebotEnabled(): boolean {
  return Boolean(cookiebotId())
}
