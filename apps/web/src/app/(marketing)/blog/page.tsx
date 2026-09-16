import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { breadcrumbSchema, itemListSchema } from '@/lib/marketing/schema'

import { BLOG_POSTS, BLOG_POST_SLUGS, BLOG_CATEGORIES } from './blog-data'

export const metadata: Metadata = {
  title: 'Steel Gate Guides & Articles | Steelyes Blog',
  description:
    'Expert guides on steel gates, driveway automation, costs, and planning. Practical advice from London gate fabricators.',
  alternates: { canonical: '/blog' },
  keywords: [
    'steel gate guide',
    'driveway gate advice',
    'gate automation tips',
    'gate cost guide',
  ],
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPage() {
  const posts = BLOG_POST_SLUGS.map((slug) => BLOG_POSTS[slug])

  return (
    <MarketingShell pathname="/blog">
      {/* Hero */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Knowledge base</p>
          <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
            Guides &
            <br />
            <span className="text-primary">articles</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            Practical advice on steel gates, automation, costs, and planning. Written by fabricators, not marketers.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-zinc-200 bg-canvas py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap gap-3">
            {Object.entries(BLOG_CATEGORIES).map(([key, category]) => (
              <span
                key={key}
                className="border border-zinc-200 bg-white px-4 py-2 font-mono text-xs uppercase tracking-widest"
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group border border-zinc-200 bg-white transition-colors hover:border-primary"
            >
              <Link href={`/blog/${post.slug}`} className="block p-6 md:p-8">
                <div className="mb-4 flex items-center gap-4 text-zinc-500">
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-bold uppercase leading-tight group-hover:text-primary md:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-muted-deep">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center gap-2 font-heading text-sm font-bold uppercase text-primary">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            Have a question we haven&apos;t answered?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-muted-deep">
            Get in touch and we&apos;ll give you a straight answer based on our workshop experience.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 bg-primary px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
          >
            Ask a question <ArrowRight className="h-4 w-4" />
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
              { name: 'Blog', path: '/blog' },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              posts.map((post) => ({
                name: post.title,
                path: `/blog/${post.slug}`,
                description: post.description,
              })),
            ),
          ),
        }}
      />
    </MarketingShell>
  )
}
