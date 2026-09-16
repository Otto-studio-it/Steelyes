import { describe, expect, it } from 'vitest'
import { createGateConfig, createGatePreset, DEFAULT_PRICING_CATALOG } from '@steelyes/gate-engine'

import { rasterizeDesignMaster } from '@/lib/configurator/design-master-pdf'
import { rasterizeLiveCad } from '@/lib/configurator/live-cad-pdf'
import { buildIndicativeQuotePdf, calculateQuotePricing } from '@/lib/configurator/quote-pdf'

describe('rasterizeDesignMaster', () => {
  it('renders the official double-swing base master as PNG', () => {
    const raster = rasterizeDesignMaster(createGateConfig(createGatePreset('double_swing')))
    expect(raster.slug).toBe('base')
    expect(raster.publicPath).toContain('double_swing/silhouettes/base.svg')
    expect(raster.png.byteLength).toBeGreaterThan(2_000)
    expect(Buffer.from(raster.png).subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  })

  it('renders the baked telescopic circles master', () => {
    const base = createGateConfig(createGatePreset('telescopic_sliding'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'circles' ? { ...option, enabled: true, quantity: 1 } : option,
      ),
    }
    const raster = rasterizeDesignMaster(config)
    expect(raster.slug).toBe('base_circles')
  })
})

describe('rasterizeLiveCad', () => {
  it('rasterizes the same installation CAD the Design preview shows', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      finish: 'anthracite_ral7016' as const,
    }
    const raster = rasterizeLiveCad(config)
    expect(raster.finishHex).toBe('#383E42')
    expect(raster.tipology).toBe('base')
    expect(raster.png.byteLength).toBeGreaterThan(2_000)
    expect(Buffer.from(raster.png).subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  })
})

describe('buildIndicativeQuotePdf', () => {
  it('embeds the official design master so the quote matches the Design preview', async () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const pdf = await buildIndicativeQuotePdf({
      config,
      pricing: calculateQuotePricing(config, DEFAULT_PRICING_CATALOG),
      shareToken: 'e2e-pdf-master',
      shareUrl: 'https://steelyes.co.uk/quote/e2e-pdf-master',
    })

    expect(pdf.byteLength).toBeGreaterThan(8_000)
    expect(Buffer.from(pdf).subarray(0, 4).toString()).toBe('%PDF')
  })
})
