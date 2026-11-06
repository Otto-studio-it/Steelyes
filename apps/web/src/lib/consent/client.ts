/**
 * Client-side consent utilities (can be imported in client components)
 */

export function reopenConsentBanner(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('sy_cookie_consent')
    window.location.reload()
  } catch {
    // localStorage blocked
  }
}
