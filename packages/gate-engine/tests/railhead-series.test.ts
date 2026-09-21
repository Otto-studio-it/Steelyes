import { describe, expect, it } from 'vitest'

import {
  listSteelyesRailheadSeries,
  railheadProductDescription,
  railheadSeriesIndex,
  railheadSeriesLabel,
  railheadWorkshopCode,
  railheadWorkshopLabel,
} from '../src/index'

describe('Steelyes railhead series names', () => {
  it('assigns stable Series 01+ names without supplier codes', () => {
    const series = listSteelyesRailheadSeries()
    expect(series[0]).toBe('RH1')
    expect(railheadSeriesLabel('RH1')).toBe('Series 01')
    expect(railheadSeriesLabel('RH1')).not.toMatch(/RH/i)
    expect(series.length).toBeGreaterThanOrEqual(60)
    expect(new Set(series).size).toBe(series.length)
  })

  it('keeps dog-bar SKUs on the same series as the top cap', () => {
    expect(railheadWorkshopCode('RH32-dog')).toBe('RH32')
    expect(railheadSeriesLabel('RH32-dog')).toBe(railheadSeriesLabel('RH32'))
    expect(railheadSeriesIndex('RH32-dog')).toBe(railheadSeriesIndex('RH32'))
  })

  it('exposes the workshop code only in the workshop label', () => {
    const customer = railheadSeriesLabel('RH32')
    expect(customer).toMatch(/^Series \d{2}$/)
    expect(customer).not.toContain('RH32')
    expect(railheadWorkshopLabel('RH32')).toBe(`${customer} (RH32)`)
  })

  it('uses the series title on customer product cards', () => {
    const copy = railheadProductDescription('RH1')
    expect(copy.title).toBe('Series 01')
    expect(copy.title).not.toMatch(/RH1/)
    expect(copy.sizeLabel).toMatch(/184/)
  })

  it('does not leak an unknown supplier slug to customers', () => {
    expect(railheadSeriesLabel('ACME-FINIAL')).toBe('Selected series')
  })
})
