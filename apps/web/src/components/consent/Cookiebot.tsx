import Script from 'next/script'

/**
 * Cookiebot (Usercentrics) CMP. Loads only when NEXT_PUBLIC_COOKIEBOT_ID is set.
 * Create the domain in Cookiebot → copy the Domain Group ID into Coolify.
 */
export function CookiebotScript() {
  const id = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim()
  if (!id) return null

  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={id}
      data-blockingmode="auto"
      strategy="beforeInteractive"
    />
  )
}

export function isCookiebotEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim())
}
