import { describe, expect, it } from 'vitest'

import {
  buildArModelPath,
  buildQuickLookHref,
  buildSceneViewerHttpsHref,
  buildSceneViewerIntentHref,
  isLocalOrPrivateArUrl,
  parseArModelFile,
} from './ar-handoff'

describe('ar-handoff', () => {
  it('locks Quick Look content scaling', () => {
    expect(buildQuickLookHref('https://steelyes.co.uk/api/ar/gate/abc.usdz')).toBe(
      'https://steelyes.co.uk/api/ar/gate/abc.usdz#allowsContentScaling=0',
    )
  })

  it('builds Scene Viewer links with resizable=false and intent fallback', () => {
    const glb = 'https://steelyes.co.uk/api/ar/gate/abc.glb'
    const https = buildSceneViewerHttpsHref(glb)
    expect(https).toContain('resizable=false')
    expect(https).toContain(encodeURIComponent(glb).replace(/%2F/g, '%2F'))
    expect(https).toContain('file=')

    const intent = buildSceneViewerIntentHref(glb)
    expect(intent.startsWith('intent://')).toBe(true)
    expect(intent).toContain('package=com.google.android.googlequicksearchbox')
    expect(intent).toContain('S.browser_fallback_url=')
    expect(intent).toContain('resizable%3Dfalse')
  })

  it('detects localhost / private AR URLs for phone warning', () => {
    expect(isLocalOrPrivateArUrl('http://localhost:3000/api/ar/gate/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('http://127.0.0.1:3000/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('http://192.168.1.10/x.glb')).toBe(true)
    expect(isLocalOrPrivateArUrl('https://steelyes.co.uk/api/ar/gate/x.glb')).toBe(false)
  })

  it('builds and parses model paths for saved configurations only', () => {
    expect(buildArModelPath('abcDEF_123-x', 'usdz')).toBe('/api/ar/gate/abcDEF_123-x.usdz')
    expect(parseArModelFile('abcDEF_123-x.GLB')).toEqual({ shareToken: 'abcDEF_123-x', format: 'glb' })
    expect(parseArModelFile('abcDEF_123-x.obj')).toBeNull()
    expect(parseArModelFile('../etc/passwd.glb')).toBeNull()
    expect(parseArModelFile('short.glb')).toBeNull()
  })
})
