import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, MapPin, Calendar, CheckCircle } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

import { CASE_STUDIES, CASE_STUDY_SLUGS, type CaseStudySlug } from '../case-study-data'

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const study = CASE_STUDIES[params.slug as CaseStudySlug]
  if (!study) return {}

  return {
    title: `${study.title} | ${study.location} Case Study`,
    description: `${study.description} View the full project details, specifications, and results.`,
    alternates: { canonical: `/case-study/${study.slug}` },
    keywords: study.keywords,
    openGraph: {
      type: 'article',
      publishedTime: `${study.completedDate}-01`,
    },
  }
}

function formatDate(dateString: string): string {
  const [year, month] = dateString.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = CASE_STUDIES[params.slug as CaseStudySlug]
  if (!study) notFound()

  return (
    <MarketingShell pathname={`/case-study/${study.slug}`}>
      {/* Header */}
      <section className="bg-steel py-10 text-white md:py-14">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <Link
            href="/case-study"
            className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All case studies
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-white/60">
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
              <MapPin className="h-3.5 w-3.5" />
              {study.location}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(study.completedDate)}
            </span>
            <span className="border border-primary/50 bg-primary/10 px-2 py-1 font-mono text-xs uppercase text-primary">
              {study.projectType}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 text-base font-light leading-relaxed text-white/80 md:text-lg">
            {study.subtitle}
          </p>
        </div>
      </section>

      {/* Project image placeholder */}
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-4xl">
          <div className="aspect-[16/9] bg-steel/20" />
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        {/* Overview */}
        <div className="mb-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Project overview</p>
          <p className="text-base font-light leading-relaxed text-muted-deep md:text-lg">
            {study.description}
          </p>
        </div>

        {/* Challenge / Solution / Result */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="border-l-2 border-zinc-300 pl-5">
            <h2 className="mb-3 font-heading text-lg font-bold uppercase">The Challenge</h2>
            <p className="text-sm font-light leading-relaxed text-muted-deep">{study.challenge}</p>
          </div>
          <div className="border-l-2 border-primary pl-5">
            <h2 className="mb-3 font-heading text-lg font-bold uppercase">Our Solution</h2>
            <p className="text-sm font-light leading-relaxed text-muted-deep">{study.solution}</p>
          </div>
          <div className="border-l-2 border-green-500 pl-5">
            <h2 className="mb-3 font-heading text-lg font-bold uppercase">The Result</h2>
            <p className="text-sm font-light leading-relaxed text-muted-deep">{study.result}</p>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12 border border-zinc-200 bg-canvas p-6 md:p-8">
          <h2 className="mb-6 font-heading text-xl font-bold uppercase">Project Specifications</h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {study.specifications.map((spec) => (
              <div key={spec.label} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <dt className="font-mono text-xs uppercase text-zinc-500">{spec.label}</dt>
                  <dd className="font-heading text-sm font-bold">{spec.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </article>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="font-heading text-xl font-bold uppercase">Similar project in mind?</h2>
              <p className="mt-2 text-sm font-light text-muted-deep">
                Every entrance is different. Tell us about yours and we&apos;ll show you what&apos;s possible.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 bg-primary px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="font-heading text-xl font-bold uppercase">Explore gate types</h2>
              <p className="mt-2 text-sm font-light text-muted-deep">
                Compare mechanisms and see which might work for your property.
              </p>
              <Link
                href="/gates"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 border border-steel bg-canvas px-6 font-heading text-sm font-bold uppercase text-steel transition-colors hover:bg-paper"
              >
                View all gates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schema: Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Case Studies', path: '/case-study' },
              { name: study.title, path: `/case-study/${study.slug}` },
            ]),
          ),
        }}
      />

      {/* Schema: CreativeWork for the case study */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: study.title,
            description: study.description,
            datePublished: `${study.completedDate}-01`,
            author: {
              '@type': 'Organization',
              name: BUSINESS.legalName,
              url: BUSINESS.website,
            },
            publisher: {
              '@type': 'Organization',
              name: BUSINESS.legalName,
              url: BUSINESS.website,
              logo: `${BUSINESS.website}/apple-icon`,
            },
            about: {
              '@type': 'Service',
              name: study.projectType,
              provider: {
                '@type': 'LocalBusiness',
                name: BUSINESS.legalName,
              },
            },
            locationCreated: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: study.location.split(',')[0],
                addressRegion: study.area,
                addressCountry: 'GB',
              },
            },
          }),
        }}
      />
    </MarketingShell>
  )
}
