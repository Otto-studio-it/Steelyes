import { describe, expect, it } from 'vitest'

import { GATE_SLUG_IMAGES, OFFICIAL_IMAGES } from './marketing-images'

const CDN = 'https://steelyes-foto.lon1.cdn.digitaloceanspaces.com'

function filesIn(urls: readonly string[]) {
  return urls.map((url) => url.slice(url.lastIndexOf('/') + 1))
}

describe('marketing photos on Spaces', () => {
  it.each(Object.entries(GATE_SLUG_IMAGES))('%s matches its folder and starts with the cover', (slug, set) => {
    expect(set.hero).toBe(set.gallery[0])
    expect(set.gallery.every((url) => url.startsWith(`${CDN}/${slug}/`))).toBe(true)
    const files = filesIn(set.gallery)
    expect(files[0]).toMatch(/^01\./)
    expect(files).toEqual([...files].sort())
    files.forEach((name, index) => {
      expect(name.startsWith(String(index + 1).padStart(2, '0') + '.')).toBe(true)
    })
  })

  it('the all-gates page uses the gates-all folder', () => {
    const all = OFFICIAL_IMAGES.gates.all
    expect(all.hero).toBe(`${CDN}/gates-all/01.jpg`)
    expect(all.gallery).toHaveLength(8)
    expect(all.gallery.every((url) => url.startsWith(`${CDN}/gates-all/`))).toBe(true)
  })

  it('staircases and railings match their folders', () => {
    const stairs = OFFICIAL_IMAGES.services.staircases
    const rails = OFFICIAL_IMAGES.services.railings

    expect(stairs.primary).toBe(stairs.gallery[0])
    expect(stairs.secondary).toBe(stairs.gallery[1])
    expect(stairs.glass).toBe(stairs.gallery[2])
    expect(stairs.gallery.every((url) => url.startsWith(`${CDN}/staircases/`))).toBe(true)
    expect(filesIn(stairs.gallery)[0]).toMatch(/^01\./)

    expect(rails.garden).toBe(rails.gallery[0])
    expect(rails.gallery.every((url) => url.startsWith(`${CDN}/railings/`))).toBe(true)
    expect(filesIn(rails.gallery)[0]).toMatch(/^01\./)
  })
})
