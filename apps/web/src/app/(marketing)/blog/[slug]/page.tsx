import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

import { BLOG_POSTS, BLOG_POST_SLUGS, BLOG_CATEGORIES, type BlogPostSlug } from '../blog-data'

export function generateStaticParams() {
  return BLOG_POST_SLUGS.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = BLOG_POSTS[params.slug as BlogPostSlug]
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.keywords,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [BUSINESS.legalName],
    },
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug as BlogPostSlug]
  if (!post) notFound()

  const category = BLOG_CATEGORIES[post.category]

  return (
    <MarketingShell pathname={`/blog/${post.slug}`}>
      {/* Header */}
      <section className="bg-steel py-10 text-white md:py-14">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all articles
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-white/60">
            <span className="border border-primary/50 bg-primary/10 px-2 py-1 font-mono text-xs uppercase text-primary">
              {category.label}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base font-light leading-relaxed text-white/80 md:text-lg">
            {post.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <div
          className="prose prose-zinc max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />
      </article>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="font-heading text-xl font-bold uppercase">Ready to start your project?</h2>
              <p className="mt-2 text-sm font-light text-muted-deep">
                Get a survey-led quote for your entrance.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 bg-primary px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="font-heading text-xl font-bold uppercase">Design your gate online</h2>
              <p className="mt-2 text-sm font-light text-muted-deep">
                Explore styles and get indicative pricing.
              </p>
              <Link
                href="/configurator"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 border border-steel bg-canvas px-6 font-heading text-sm font-bold uppercase text-steel transition-colors hover:bg-paper"
              >
                Open configurator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
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
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
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
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${BUSINESS.website}/blog/${post.slug}`,
            },
          }),
        }}
      />
    </MarketingShell>
  )
}

/**
 * Simple markdown-like conversion for blog content.
 * Handles headings, paragraphs, lists, links, and tables.
 */
function markdownToHtml(content: string): string {
  return content
    .split('\n\n')
    .map((block) => {
      block = block.trim()
      if (!block) return ''

      // Headings
      if (block.startsWith('### ')) {
        return `<h3>${block.slice(4)}</h3>`
      }
      if (block.startsWith('## ')) {
        return `<h2>${block.slice(3)}</h2>`
      }

      // Lists
      if (block.startsWith('- ')) {
        const items = block.split('\n').map((line) => {
          const text = line.replace(/^- /, '')
          return `<li>${processInline(text)}</li>`
        })
        return `<ul>${items.join('')}</ul>`
      }

      // Numbered lists
      if (/^\d+\. /.test(block)) {
        const items = block.split('\n').map((line) => {
          const text = line.replace(/^\d+\. /, '')
          return `<li>${processInline(text)}</li>`
        })
        return `<ol>${items.join('')}</ol>`
      }

      // Tables
      if (block.includes('|')) {
        const lines = block.split('\n').filter((l) => l.trim())
        if (lines.length >= 2) {
          const headerCells = lines[0].split('|').filter((c) => c.trim())
          const bodyLines = lines.slice(2) // Skip header and separator
          const headerHtml = headerCells.map((c) => `<th>${c.trim()}</th>`).join('')
          const bodyHtml = bodyLines
            .map((line) => {
              const cells = line.split('|').filter((c) => c.trim())
              return `<tr>${cells.map((c) => `<td>${processInline(c.trim())}</td>`).join('')}</tr>`
            })
            .join('')
          return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`
        }
      }

      // Paragraph
      return `<p>${processInline(block)}</p>`
    })
    .join('\n')
}

function processInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
