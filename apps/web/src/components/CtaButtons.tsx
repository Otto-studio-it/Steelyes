'use client'

import Link from 'next/link'

export function CtaButtons() {
  return (
    <div className="flex gap-4">
      <Link
        href="/contact"
        className="px-6 py-3 bg-primary text-white font-semibold transition-colors duration-100 hover:bg-primary-container"
      >
        Get a Quote
      </Link>
      <Link
        href="/gates"
        className="px-6 py-3 border-2 border-primary text-primary font-semibold transition-colors duration-100 hover:bg-primary hover:text-white"
      >
        View Catalogue
      </Link>
    </div>
  )
}
