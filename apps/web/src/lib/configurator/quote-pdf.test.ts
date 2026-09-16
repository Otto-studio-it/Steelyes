import { describe, expect, it } from 'vitest'
import { createGateConfig, createGatePreset } from '@steelyes/gate-engine'

import { rasterizeDesignMaster } from '@/lib/configurator/design-master-pdf'
import { buildIndicativeQuotePdf, calculateQuotePricing } from '@/lib/configurator/quote-pdf'
import { DEFAULT_PRICING_CATALOG } from '@steelyes/gate-engine'

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

describe('buildIndicativeQuotePdf', () => {
  it('embeds the Design master instead of a mismatched CAD elevation', async () => {
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
