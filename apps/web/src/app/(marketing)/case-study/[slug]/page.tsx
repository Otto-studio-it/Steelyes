import { notFound } from 'next/navigation'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

const CASE_STUDIES: Record<string, string> = {
  'the-dream-gate': 'The Dream Gate',
}

type CaseStudyPageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }))
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const title = CASE_STUDIES[params.slug]
  if (!title) notFound()

  return (
    <MarketingShell pathname={`/case-study/${params.slug}`}>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#9E000C]">Case study</p>
        <h1 className="mt-3 font-heading text-5xl font-black uppercase md:text-7xl">{title}</h1>
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <MediaPlaceholder label="Case study hero" aspectClassName="aspect-[4/3] w-full" />
        <article className="space-y-4 border border-zinc-200 bg-white p-6">
          <h2 className="font-heading text-3xl font-bold uppercase">Project overview</h2>
          <p className="font-light text-[#5C403D]">
            Placeholder case-study body. Final approved copy and project details will be inserted from client assets.
          </p>
        </article>
      </section>
    </MarketingShell>
  )
}
