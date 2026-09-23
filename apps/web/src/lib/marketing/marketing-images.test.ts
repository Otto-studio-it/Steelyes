import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { GATE_SLUG_IMAGES, OFFICIAL_IMAGES } from './marketing-images'

const CDN = 'https://steelyes-foto.lon1.cdn.digitaloceanspaces.com'
const photoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../../docs/frontend/photo',
)

function numberedFiles(folder: string) {
  return readdirSync(path.join(photoRoot, folder))
    .filter((name) => /^\d{2}\./.test(name))
    .sort()
}

function filesIn(urls: readonly string[]) {
  return urls.map((url) => url.slice(url.lastIndexOf('/') + 1))
}

describe('marketing photos on Spaces', () => {
  it.each(Object.entries(GATE_SLUG_IMAGES))('%s matches its folder and starts with the cover', (slug, set) => {
    expect(set.hero).toBe(set.gallery[0])
    expect(set.gallery.every((url) => url.startsWith(`${CDN}/${slug}/`))).toBe(true)
    expect(filesIn(set.gallery)).toEqual(numberedFiles(slug))
  })

  it('staircases and railings match their folders', () => {
    expect(filesIn(OFFICIAL_IMAGES.services.staircases.gallery)).toEqual(numberedFiles('staircases'))
    expect(OFFICIAL_IMAGES.services.staircases.primary).toBe(OFFICIAL_IMAGES.services.staircases.gallery[0])
    expect(OFFICIAL_IMAGES.services.staircases.secondary).toBe(OFFICIAL_IMAGES.services.staircases.gallery[1])
    expect(OFFICIAL_IMAGES.services.staircases.glass).toBe(OFFICIAL_IMAGES.services.staircases.gallery[2])
    expect(filesIn(OFFICIAL_IMAGES.services.railings.gallery)).toEqual(numberedFiles('railings'))
    expect(OFFICIAL_IMAGES.services.railings.garden).toBe(OFFICIAL_IMAGES.services.railings.gallery[0])
  })
})
