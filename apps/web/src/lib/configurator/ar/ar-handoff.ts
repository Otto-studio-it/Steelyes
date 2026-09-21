/**
 * Pure helpers for native AR handoff (Quick Look / Scene Viewer).
 * Keep scale locked — Phase 1 envelope is meaningless if the user can pinch-resize.
 */

export const AR_MODEL_TTL_SECONDS = 60 * 60

/** Real exports are < 1 MB (≈0.2–0.6 MB); 5 MB leaves headroom without inviting abuse. */
export const AR_MODEL_MAX_BYTES = 5 * 1024 * 1024

export type ArModelFormat = 'glb' | 'usdz'

/** GLB starts with glTF binary magic "glTF". */
export function looksLikeGlb(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 12) return false
  return (
    bytes[0] === 0x67 && // g
    bytes[1] === 0x6c && // l
    bytes[2] === 0x54 && // T
    bytes[3] === 0x46 // F
  )
}

/** USDZ is a zip (PK\x03\x04) containing USDA/USDC. */
export function looksLikeUsdz(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 4) return false
  return bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)
}

export function validateArModelBytes(format: ArModelFormat, bytes: Uint8Array): string | null {
  if (bytes.byteLength < 32) return 'Model file is too small'
  if (bytes.byteLength > AR_MODEL_MAX_BYTES) return 'Model file is too large (max 5 MB)'
  if (format === 'glb' && !looksLikeGlb(bytes)) return 'Payload is not a valid GLB'
  if (format === 'usdz' && !looksLikeUsdz(bytes)) return 'Payload is not a valid USDZ'
  return null
}

export function isLocalOrPrivateArUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
    if (host.endsWith('.local')) return true
    if (/^10\./.test(host)) return true
    if (/^192\.168\./.test(host)) return true
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true
    return false
  } catch {
    return true
  }
}

/**
 * Apple Quick Look — absolute HTTPS .usdz URL with content scaling disabled
 * so tape checks match GateConfig millimetres.
 */
export function buildQuickLookHref(usdzUrl: string): string {
  const base = usdzUrl.split('#')[0] ?? usdzUrl
  return `${base}#allowsContentScaling=0`
}

/**
 * Google Scene Viewer intent (ARCore) with HTTPS browser fallback.
 * `resizable=false` locks real-world scale.
 */
export function buildSceneViewerIntentHref(glbUrl: string): string {
  const viewerQuery = new URLSearchParams({
    file: glbUrl,
    mode: 'ar_preferred',
    resizable: 'false',
  })
  const httpsFallback = `https://arvr.google.com/scene-viewer/1.0?${viewerQuery.toString()}`
  const intentPath = `arvr.google.com/scene-viewer/1.0?${viewerQuery.toString()}`
  return `intent://${intentPath}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(httpsFallback)};end;`
}

/** Plain HTTPS Scene Viewer URL (desktop copy / non-intent fallback). */
export function buildSceneViewerHttpsHref(glbUrl: string): string {
  const viewerQuery = new URLSearchParams({
    file: glbUrl,
    mode: 'ar_preferred',
    resizable: 'false',
  })
  return `https://arvr.google.com/scene-viewer/1.0?${viewerQuery.toString()}`
}

export function formatArExpiryLabel(expiresAtMs: number, nowMs: number = Date.now()): string {
  const remainingSec = Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000))
  if (remainingSec <= 0) return 'Link expired'
  const minutes = Math.floor(remainingSec / 60)
  const seconds = remainingSec % 60
  if (minutes <= 0) return `Expires in ${seconds}s`
  return `Expires in ${minutes}m ${seconds.toString().padStart(2, '0')}s`
}
