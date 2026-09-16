import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { breadcrumbSchema, itemListSchema } from '@/lib/marketing/schema'

import { CASE_STUDIES, CASE_STUDY_SLUGS } from './case-study-data'

export const metadata: Metadata = {
  title: 'Case Studies | Steel Gate Projects London & South East',
  description:
    'View completed steel gate projects across London and the South East. Real examples of bespoke driveway gates, automated gates, and commercial security installations.',
  alternates: { canonical: '/case-study' },
  keywords: [
    'steel gate case studies',
    'gate installation examples',
    'driveway gate projects london',
    'bespoke gate portfolio',
  ],
}

function formatDate(dateString: string): string {
  const [year, month] = dateString.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function CaseStudyIndexPage() {
  const caseStudies = CASE_STUDY_SLUGS.map((slug) => CASE_STUDIES[slug])

  return (
    <MarketingShell pathname="/case-study">
      {/* Hero */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Project portfolio</p>
          <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
            Case
            <br />
            <span className="text-primary">studies</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            Real projects from across London and the South East. Each case study shows our approach to 
            solving specific entrance challenges with bespoke steel fabrication.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="group border border-zinc-200 bg-white transition-colors hover:border-primary"
            >
              <Link href={`/case-study/${study.slug}`} className="block">
                <div className="aspect-[4/3] bg-steel" />
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-zinc-500">
                    <span className="flex items-center gap-1 font-mono text-xs">
                      <MapPin className="h-3.5 w-3.5" />
                      {study.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(study.completedDate)}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-bold uppercase group-hover:text-primary">
                    {study.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{study.projectType}</p>
                  <p className="mt-3 line-clamp-2 text-sm font-light text-muted-deep">
                    {study.subtitle}
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-heading text-sm font-bold uppercase text-primary">
                    Read case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="font-heading text-2xl font-black uppercase md:text-3xl">
            Start your project
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-muted-deep">
            Every case study began with a conversation. Tell us about your entrance and we&apos;ll 
            show you what&apos;s possible.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 bg-primary px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
          >
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Case Studies', path: '/case-study' },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              caseStudies.map((study) => ({
                name: study.title,
                path: `/case-study/${study.slug}`,
                description: study.subtitle,
              })),
            ),
          ),
        }}
      />
    </MarketingShell>
  )
}
