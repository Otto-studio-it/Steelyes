import { describe, expect, it } from 'vitest'

import { detectArClientPlatform } from './ar-client-platform'

describe('detectArClientPlatform', () => {
  it('detects iPhone Safari', () => {
    expect(
      detectArClientPlatform(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      ),
    ).toBe('ios')
  })

  it('detects iPadOS desktop UA via touch points', () => {
    expect(
      detectArClientPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        5,
      ),
    ).toBe('ios')
  })

  it('keeps desktop Mac as desktop', () => {
    expect(
      detectArClientPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        0,
      ),
    ).toBe('desktop')
  })

  it('detects Android Chrome', () => {
    expect(
      detectArClientPlatform(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      ),
    ).toBe('android')
  })

  it('defaults unknown UA to desktop', () => {
    expect(detectArClientPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('desktop')
  })
})
