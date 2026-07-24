import type { RailheadVariantCatalog } from './types'

/**
 * Provisional schematic railhead catalogue — unit prices indicative until Marius confirms.
 * Replace entries or set status to confirmed when production data is signed off.
 */
export const DEFAULT_RAILHEAD_VARIANT_CATALOG: RailheadVariantCatalog = {
  status: 'provisional',
  blockedReason: '',
  owner: 'Marius',
  entries: [
    {
      slug: 'ball-finial',
      label: 'Ball finial',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 12.5,
      appliesTo: {
        styles: ['traditional_victorian'],
        gateTypes: ['double_swing', 'single_swing'],
      },
      notes: 'Schematic provisional price — survey confirms final railhead SKU.',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'spear-finial',
      label: 'Spear finial',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 14,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Schematic provisional price — survey confirms final railhead SKU.',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'spear-dog-bar',
      label: 'Spear dog-bar railhead',
      status: 'provisional',
      optionKey: 'dog_bar_railheads',
      unitPriceGbp: 8,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Schematic provisional price.',
      adminSlug: 'railheads-dog-bars',
    },
    {
      slug: 'composite-cap',
      label: 'Composite cap',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 6,
      appliesTo: {
        styles: ['composite_boards'],
      },
      notes: 'Schematic provisional price.',
    },
  ],
}
