import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'
import { DEFAULT_RAILHEAD_VARIANT_CATALOG, railheadPhotoFileSlug } from '@steelyes/gate-engine'

import { railheadPhotoPath } from '@/lib/configurator/railhead'

const PHOTO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public/2d-masters/railheads/photos')

describe('definitive railhead catalogue photos', () => {
  const files = new Set(readdirSync(PHOTO_DIR).filter((name) => name.endsWith('.webp')))

  it('maps every catalog SKU to a public WebP', () => {
    const slugs = Array.from(
      new Set(DEFAULT_RAILHEAD_VARIANT_CATALOG.entries.map((entry) => entry.slug)),
    )
    expect(slugs.length).toBeGreaterThanOrEqual(60)
    for (const slug of slugs) {
      const file = `${railheadPhotoFileSlug(slug)}.webp`
      expect(files.has(file), `missing ${file} for ${slug}`).toBe(true)
      expect(railheadPhotoPath(slug)).toBe(`/2d-masters/railheads/photos/${file}`)
    }
  })

  it('keeps the RH15WO alias on the RH15W tile', () => {
    expect(railheadPhotoFileSlug('RH15WO')).toBe('RH15W')
    expect(files.has('RH15W.webp')).toBe(true)
  })
})
