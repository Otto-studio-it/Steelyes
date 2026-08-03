import type { RailheadVariantCatalog } from './types'

/**
 * Railhead variant catalogue — unit prices from client Numbers/CSV
 * (`foto /railhead/ordine degli railhead…` → `docs/frontend/foto-intake/railheads-catalog.json`).
 *
 * Primary 6 SKUs = most-used overlay set for 2D/Figma (`docs/frontend/2d-masters/railheads`).
 * Status stays `provisional` until Marius signs count rules + live listino.
 * Prices are EX VAT. Do not invent missing SKU prices.
 */
export const DEFAULT_RAILHEAD_VARIANT_CATALOG: RailheadVariantCatalog = {
  status: 'provisional',
  blockedReason: '',
  owner: 'Marius',
  entries: [
    {
      slug: 'RH32',
      label: 'RH32 Classic spear',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.55,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 136×60×14 mm · £0.55 ex VAT. 2D overlay: docs/frontend/2d-masters/railheads/silhouettes/RH32.svg',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'RH7',
      label: 'RH7 Fleur-de-lis',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.35,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 125×60×12 mm · £0.35 ex VAT. 2D overlay: …/railheads/silhouettes/RH7.svg',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'RH7NP',
      label: 'RH7NP Fleur (no peg)',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.29,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 110×60×20 mm · £0.29 ex VAT · no peg. 2D overlay: …/railheads/silhouettes/RH7NP.svg',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'RH6WB',
      label: 'RH6W/B Ball on taper',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.4,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 100×20×20 mm · £0.40 ex VAT · with ball. 2D overlay: …/railheads/silhouettes/RH6WB.svg',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'RH14',
      label: 'RH14 Ball + collar',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.5,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 95×25×12 mm · £0.50 ex VAT. 2D overlay: …/railheads/silhouettes/RH14.svg',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'RH100',
      label: 'RH100 Ornate fleur',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 0.6,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes:
        'Client catalog: 160×70×28 mm · £0.60 ex VAT. 2D overlay: …/railheads/silhouettes/RH100.svg',
      adminSlug: 'railheads-top',
    },
    // Dog-bar row uses the same slim/common heads until a dedicated SKU is confirmed.
    {
      slug: 'RH32-dog',
      label: 'RH32 on dog bars',
      status: 'provisional',
      optionKey: 'dog_bar_railheads',
      unitPriceGbp: 0.55,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Same unit as RH32 top — dog-bar row overlay until Marius splits SKUs.',
      adminSlug: 'railheads-dog-bars',
    },
    {
      slug: 'RH7-dog',
      label: 'RH7 on dog bars',
      status: 'provisional',
      optionKey: 'dog_bar_railheads',
      unitPriceGbp: 0.35,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Same unit as RH7 top — dog-bar row overlay until Marius splits SKUs.',
      adminSlug: 'railheads-dog-bars',
    },
    {
      slug: 'RH14-dog',
      label: 'RH14 on dog bars',
      status: 'provisional',
      optionKey: 'dog_bar_railheads',
      unitPriceGbp: 0.5,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Same unit as RH14 top — dog-bar row overlay until Marius splits SKUs.',
      adminSlug: 'railheads-dog-bars',
    },
  ],
}
