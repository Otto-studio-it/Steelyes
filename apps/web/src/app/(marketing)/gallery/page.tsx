import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { GalleryClient } from './GalleryClient'

export const metadata: Metadata = {
  title: 'Project Gallery | Installed Bespoke Steel Gates & Steelwork',
  description:
    'A collection of completed Steelyes commissions — driveway gates, electric gates, railings, balconies and security installations across the UK.',
}

export default function GalleryPage() {
  return (
    <MarketingShell pathname="/gallery">
      <section className="mx-auto max-w-7xl border-l-4 border-[#9E000C] px-4 py-10 md:px-8 md:py-16">
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          The installation
          <br />
          <span className="text-[#9E000C]">Archive</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
          A definitive collection of Steelyes commissions — gates, railings and balconies surveyed, fabricated and
          installed across the UK.
        </p>
      </section>

      <GalleryClient />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <button
          type="button"
          className="mx-auto flex min-h-[48px] items-center justify-center border border-[#9E000C] bg-white px-8 font-heading text-sm font-bold uppercase tracking-tight text-[#9E000C]"
        >
          Load more projects
        </button>
      </section>
    </MarketingShell>
  )
}
