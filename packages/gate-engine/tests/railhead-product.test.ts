import { describe, expect, it } from 'vitest'

import { railheadPhotoFileSlug, railheadProductDescription } from '../src/catalog/railhead-product'

describe('railhead product cards', () => {
  it('uses the dedicated RH15W product shot for catalog slug RH15WO', () => {
    expect(railheadPhotoFileSlug('RH15WO')).toBe('RH15W')
  })

  it('reuses the top product photo for dog-bar SKUs', () => {
    expect(railheadPhotoFileSlug('RH32-dog')).toBe('RH32')
  })

  it('surfaces the Steelyes series title and client size', () => {
    const copy = railheadProductDescription('RH1')
    expect(copy.title).toBe('Series 01')
    expect(copy.sizeLabel).toMatch(/184/)
  })
})
