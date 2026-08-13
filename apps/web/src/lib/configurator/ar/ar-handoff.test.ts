import { describe, expect, it } from 'vitest'

import {
  AR_MODEL_TTL_SECONDS,
  buildQuickLookHref,
  buildSceneViewerHttpsHref,
  buildSceneViewerIntentHref,
  formatArExpiryLabel,
  isLocalOrPrivateArUrl,
  looksLikeGlb,
  looksLikeUsdz,
  validateArModelBytes,
} from './ar-handoff'

describe('ar-handoff', () => {
  it('locks Quick Look content scaling', () => {
    expect(buildQuickLookHref('https://steelyes.co.uk/api/ar/models/abc.usdz')).toBe(
      'https://steelyes.co.uk/api/ar/models/abc.usdz#allowsContentScaling=0',
    )
  })

  it('builds Scene Viewer links with resizable=false and intent fallback', () => {
    const glb = 'https://steelyes.co.uk/api/ar/models/abc.glb'
    const https = buildSceneViewerHttpsHref(glb)
    expect(https).toContain('resizable=false')
    expect(https).toContain(encodeURIComponent(glb).replace(/%2F/g, '%2F'))
    expect(https).toContain('file=')

    const intent = buildSceneViewerIntentHref(glb)
    expect(intent.startsWith('intent://')).toBe(true)
    expect(intent).toContain('package=com.google.ar.core')
    expect(intent).toContain('S.browser_fallback_url=')
    expect(intent).toContain('resizable%3Dfalse')
  })

  it('detects localhost / private AR URLs for phone warning', () => {
    expect(isLocalOrPrivateArUrl('http://localhost:3000/api/ar/models/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('http://127.0.0.1:3000/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('http://192.168.1.10/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('https://steelyes.co.uk/api/ar/models/x.glb')).toBe(false)
  })

  it('validates GLB / USDZ magic bytes', () => {
    const glb = new Uint8Array(64)
    glb[0] = 0x67
    glb[1] = 0x6c
    glb[2] = 0x54
    glb[3] = 0x46
    expect(looksLikeGlb(glb)).toBe(true)
    expect(validateArModelBytes('glb', glb)).toBeNull()

    const usdz = new Uint8Array(64)
    usdz[0] = 0x50
    usdz[1] = 0x4b
    usdz[2] = 0x03
    usdz[3] = 0x04
    expect(looksLikeUsdz(usdz)).toBe(true)
    expect(validateArModelBytes('usdz', usdz)).toBeNull()

    expect(validateArModelBytes('glb', new Uint8Array(64))).toMatch(/not a valid GLB/)
  })

  it('formats expiry labels', () => {
    const now = 1_000_000
    expect(formatArExpiryLabel(now - 1, now)).toBe('Link expired')
    expect(formatArExpiryLabel(now + 90_000, now)).toBe('Expires in 1m 30s')
    expect(AR_MODEL_TTL_SECONDS).toBe(3600)
  })
})
