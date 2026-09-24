import { describe, expect, it } from 'vitest'

import { PAGE_MUSIC, PAGE_VIDEOS } from './page-videos'

describe('page videos', () => {
  it('uses only the two Upbeat tracks and never an empty clip list', () => {
    const allowed = new Set<string>(Object.values(PAGE_MUSIC))
    for (const page of Object.values(PAGE_VIDEOS)) {
      expect(allowed.has(page.music)).toBe(true)
      expect(page.clips.length).toBeGreaterThan(0)
      for (const clip of page.clips) {
        expect(clip.src.endsWith('.mp4')).toBe(true)
        expect(clip.caption.length).toBeGreaterThan(0)
      }
    }
  })

  it('does not invent a video for staircases', () => {
    expect(PAGE_VIDEOS.staircases).toBeUndefined()
  })
})
