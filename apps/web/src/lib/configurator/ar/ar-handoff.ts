/**
 * Pure helpers for native AR handoff (Quick Look / Scene Viewer).
 * Keep scale locked — the real-mm envelope is meaningless if the user can pinch-resize.
 */

import { isValidShareToken } from '@/lib/configurator/share-token'

export type ArModelFormat = 'glb' | 'usdz'

export const AR_MODEL_CONTENT_TYPES: Record<ArModelFormat, string> = {
  glb: 'model/gltf-binary',
  usdz: 'model/vnd.usdz+zip',
}

/** Server-generated model for a saved configuration. The path ends in the real extension — viewers sniff it. */
export function buildArModelPath(shareToken: string, format: ArModelFormat): string {
  return `/api/ar/gate/${encodeURIComponent(shareToken)}.${format}`
}

export function parseArModelFile(file: string): { shareToken: string; format: ArModelFormat } | null {
  const match = /^(.+)\.(glb|usdz)$/i.exec(file)
  if (!match || !isValidShareToken(match[1]!)) return null
  return { shareToken: match[1]!, format: match[2]!.toLowerCase() as ArModelFormat }
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

function sceneViewerQuery(glbUrl: string): string {
  // `resizable=false` locks real-world scale.
  return new URLSearchParams({ file: glbUrl, mode: 'ar_preferred', resizable: 'false' }).toString()
}

/**
 * Google Scene Viewer intent with HTTPS browser fallback. `ar_preferred` must target the Google
 * app package — `com.google.ar.core` is only for `ar_only` and fails on phones without ARCore
 * instead of falling back to the 3D view.
 */
export function buildSceneViewerIntentHref(glbUrl: string): string {
  const query = sceneViewerQuery(glbUrl)
  const httpsFallback = `https://arvr.google.com/scene-viewer/1.0?${query}`
  return `intent://arvr.google.com/scene-viewer/1.0?${query}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(httpsFallback)};end;`
}

/** Plain HTTPS Scene Viewer URL (desktop copy / non-intent fallback). */
export function buildSceneViewerHttpsHref(glbUrl: string): string {
  return `https://arvr.google.com/scene-viewer/1.0?${sceneViewerQuery(glbUrl)}`
}
