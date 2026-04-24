'use client'

import { trackGetQuoteClicked, trackCatalogueViewed } from '@/app/actions'

export function CtaButtons() {
  return (
    <div className="flex gap-4">
      <button
        className="px-6 py-3 bg-primary text-white font-semibold transition-colors duration-100 hover:bg-primary-container"
        onClick={() => trackGetQuoteClicked()}
      >
        Get a Quote
      </button>
      <button
        className="px-6 py-3 border-2 border-primary text-primary font-semibold transition-colors duration-100 hover:bg-primary hover:text-white"
        onClick={() => trackCatalogueViewed()}
      >
        View Catalogue
      </button>
    </div>
  )
}
