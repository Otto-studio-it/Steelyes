import Link from 'next/link'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export const metadata: Metadata = {
  title: 'Case Studies | Bespoke Steel Gate Projects',
  description:
    'In-depth project case studies from the Steelyes workshop. Real driveway gate and fabrication installations with process notes and finished results.',
}

const CASE_STUDIES = [
  {
    slug: 'the-dream-gate',
    title: 'The Dream Gate',
    label: 'Bespoke driveway gate',
    status: 'placeholder' as const,
  },
] as const

export default function CaseStudyIndexPage() {
  return (
    <MarketingShell pathname="/case-study">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Projects</p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">Case studies</h1>
        <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
          Completed gate and fabrication commissions. Specifications, installation notes, and process records from real
          Steelyes projects.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
          Project archive being built — more entries added as commissions complete.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map(({ slug, title, label, status }) => (
            <article key={slug} className="group border border-zinc-200 bg-white">
              <Link href={`/case-study/${slug}`} className="block">
                <div className="relative overflow-hidden bg-[#EFEEEB]">
                  <MediaPlaceholder label={`${title} case study image`} aspectClassName="aspect-[4/3] w-full" />
                  {status === 'placeholder' && (
                    <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[10px] uppercase text-zinc-400">
                      Placeholder
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[#9E000C]">{label}</p>
                <h2 className="mt-2 font-heading text-2xl font-black uppercase">
                  <Link href={`/case-study/${slug}`} className="transition-colors hover:text-[#9E000C]">
                    {title}
                  </Link>
                </h2>
                <Link
                  href={`/case-study/${slug}`}
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-[#9E000C] hover:underline"
                >
                  View project
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-[#F5F3F0] py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-black uppercase md:text-4xl">Have a project in mind?</h2>
              <p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-[#5C403D]">
                Send photos, drawings, or a rough brief. We will outline what is feasible and the survey path to a
                measured quote.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center bg-[#9E000C] px-8 py-3 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515]"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
