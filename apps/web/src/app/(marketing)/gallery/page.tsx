import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { GALLERY_CONSENT_NOTICE } from '@/lib/marketing/business'

import { GalleryClient } from './GalleryClient'

export const metadata: Metadata = {
  title: 'Workshop Gallery | Steelyes Fabrication',
  description:
    'Workshop and consented project photos from Steelyes fabrication — not a full residential portfolio until owner consent is confirmed.',
}

export default function GalleryPage() {
  return (
    <MarketingShell pathname="/gallery">
      <section className="mx-auto max-w-7xl border-l-4 border-[#9E000C] px-4 py-10 md:px-8 md:py-16">
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Workshop
          <br />
          <span className="text-[#9E000C]">gallery</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
          Fabrication detail and consented project photos. Residential property images are only shown with owner
          approval.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-[#9E000C] pl-4 font-mono text-xs uppercase tracking-wide text-[#5C403D]">
          {GALLERY_CONSENT_NOTICE}
        </p>
      </section>

      <GalleryClient />
    </MarketingShell>
  )
}
