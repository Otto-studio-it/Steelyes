export type ArClientPlatform = 'ios' | 'android' | 'desktop'

export function detectArClientPlatform(
  userAgent: string,
  maxTouchPoints: number = 0,
): ArClientPlatform {
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios'
  if (/Macintosh/.test(userAgent) && maxTouchPoints > 1) return 'ios'
  if (/Android/.test(userAgent)) return 'android'
  return 'desktop'
}
