/* eslint-disable @next/next/no-sync-scripts -- Cookiebot auto-blocking requires synchronous execution as first script in head. */

function cookiebotId(): string | null {
  const id = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim()
  return id || null
}

/**
 * Banner / CMP script — Cookiebot must load synchronously as the first script in <head>
 * for auto-blocking to work (blocks third-party scripts before they execute).
 * Do NOT use async/defer with data-blockingmode="auto" per Cookiebot documentation.
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
      type="text/javascript"
    />
  )
}

export function isCookiebotEnabled(): boolean {
  return Boolean(cookiebotId())
}
