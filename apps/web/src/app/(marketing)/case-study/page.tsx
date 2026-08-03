import type { Metadata } from 'next'
import Link from 'next/link'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'

export const metadata: Metadata = {
  title: 'Case Studies | Coming Soon',
  description: 'Steelyes project case studies will be published with client-approved content.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/case-study' },
}

/** Hidden until Marius supplies approved case-study content (roadmap D2). */
export default function CaseStudyIndexPage() {
  return (
    <MarketingShell pathname="/case-study">
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Case studies</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
          Coming soon
        </h1>
        <p className="mt-5 text-base font-light leading-relaxed text-muted-deep">
          We only publish named project stories with client approval. Until those materials are ready, this
          section stays offline — ask us for relevant references when you enquire.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] items-center justify-center bg-primary px-6 font-heading text-sm font-bold uppercase tracking-tight text-white"
          >
            Request a quote
          </Link>
          <a
            href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent('Case study / project references')}`}
            className="inline-flex min-h-[48px] items-center justify-center border border-zinc-300 px-6 font-heading text-sm font-bold uppercase tracking-tight text-steel"
          >
            Email for references
          </a>
        </div>
      </section>
    </MarketingShell>
  )
}
