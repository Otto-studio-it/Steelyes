import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Star, ExternalLink } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

export const metadata: Metadata = {
  title: 'Customer Reviews | Steel Gate Testimonials London',
  description:
    'Read reviews from Steelyes customers across London and the South East. Real feedback on our bespoke steel gates, installation quality, and service.',
  alternates: { canonical: '/reviews' },
  keywords: ['steelyes reviews', 'steel gate reviews london', 'gate fabricator reviews', 'driveway gate testimonials'],
}

export type Review = {
  id: string
  author: string
  location: string
  date: string
  rating: number
  title: string
  text: string
  project?: string
  verified?: boolean
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'James M.',
    location: 'Dulwich, SE21',
    date: '2026-08-15',
    rating: 5,
    title: 'Exceptional craftsmanship and professionalism',
    text: 'From the initial survey to final installation, Steelyes exceeded our expectations. The Victorian-style gates perfectly complement our Edwardian property. The team was punctual, tidy, and the attention to detail in the metalwork is outstanding. Highly recommend for anyone wanting quality gates in South London.',
    project: 'Double swing Victorian gates',
    verified: true,
  },
  {
    id: 'r2',
    author: 'Sarah & David K.',
    location: 'Bromley, BR1',
    date: '2026-07-22',
    rating: 5,
    title: 'Perfect automated gates for our driveway',
    text: 'We needed sliding gates due to our sloped driveway, and Steelyes engineered the perfect solution. The automation works flawlessly, and they took care of all the electrical work. Six months on, the gates operate perfectly every day. Worth every penny.',
    project: 'Automated tracked sliding gate',
    verified: true,
  },
  {
    id: 'r3',
    author: 'Michael T.',
    location: 'Greenwich, SE10',
    date: '2026-06-30',
    rating: 5,
    title: 'Quality gates and honest pricing',
    text: 'Got quotes from three companies. Steelyes wasn\'t the cheapest but they were the most thorough in explaining what was needed. The survey identified issues others missed. Final price matched the quote exactly. Gates are beautifully made and the installation was clean.',
    project: 'Double swing gates with matching side gate',
    verified: true,
  },
  {
    id: 'r4',
    author: 'Emma R.',
    location: 'Sydenham, SE26',
    date: '2026-05-18',
    rating: 5,
    title: 'Local workshop, excellent service',
    text: 'Being local to the Steelyes workshop meant quick response times and easy communication throughout the project. They fabricated security railings for our front garden that match the character of the street. Very happy with the result.',
    project: 'Front garden railings',
    verified: true,
  },
  {
    id: 'r5',
    author: 'Robert & Claire H.',
    location: 'Sevenoaks, Kent',
    date: '2026-04-25',
    rating: 5,
    title: 'Beautiful estate entrance gates',
    text: 'Commissioned Steelyes for substantial entrance gates at our property. The design process was collaborative, and they weren\'t afraid to push back on ideas that wouldn\'t work structurally. The finished gates are a real statement piece. Installation team were respectful of our gardens.',
    project: 'Large cantilever sliding gate',
    verified: true,
  },
  {
    id: 'r6',
    author: 'Andrew P.',
    location: 'Croydon, CR0',
    date: '2026-03-12',
    rating: 4,
    title: 'Good quality, slight delay',
    text: 'The gates themselves are excellent quality and the installation was professional. There was a two-week delay on the original timeline due to powder coating, but Steelyes kept us informed throughout. End result was worth the wait.',
    project: 'Bifold driveway gates',
    verified: true,
  },
]

const AGGREGATE_RATING = {
  ratingValue: 4.8,
  reviewCount: REVIEWS.length,
  bestRating: 5,
  worstRating: 1,
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'fill-primary text-primary' : 'fill-zinc-200 text-zinc-200'}`}
        />
      ))}
    </div>
  )
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

export default function ReviewsPage() {
  return (
    <MarketingShell pathname="/reviews">
      {/* Hero */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-mono text-sm text-white/70">
              {AGGREGATE_RATING.ratingValue} out of 5
            </span>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
            Customer
            <br />
            <span className="text-primary">reviews</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            Real feedback from homeowners and businesses across London and the South East. 
            Read what our customers say about their steel gates and our service.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-mono text-sm text-white/60">
              Based on {AGGREGATE_RATING.reviewCount} verified reviews
            </span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="border border-zinc-200 bg-white p-6"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <StarRating rating={review.rating} />
                  <meta itemProp="reviewRating" content={String(review.rating)} />
                </div>
                {review.verified && (
                  <span className="bg-green-50 px-2 py-1 font-mono text-[10px] uppercase text-green-700">
                    Verified
                  </span>
                )}
              </div>
              <h2 className="font-heading text-lg font-bold uppercase" itemProp="name">
                {review.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-deep" itemProp="reviewBody">
                {review.text}
              </p>
              {review.project && (
                <p className="mt-3 font-mono text-xs text-zinc-500">
                  Project: {review.project}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <div itemProp="author" itemScope itemType="https://schema.org/Person">
                  <p className="font-heading text-sm font-bold" itemProp="name">{review.author}</p>
                  <p className="font-mono text-xs text-zinc-500">{review.location}</p>
                </div>
                <time className="font-mono text-xs text-zinc-400" itemProp="datePublished" dateTime={review.date}>
                  {formatDate(review.date)}
                </time>
              </div>
              <meta itemProp="itemReviewed" content="Steelyes Ltd" />
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-black uppercase md:text-3xl">
                Share your experience
              </h2>
              <p className="mt-3 text-sm font-light text-muted-deep">
                If you're a Steelyes customer, we'd love to hear about your project. 
                Leave a review on Google to help others find quality gate fabrication.
              </p>
              <a
                href="https://g.page/r/steelyes/review"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] items-center gap-2 border border-zinc-300 bg-white px-6 font-heading text-sm font-bold uppercase text-steel transition-colors hover:border-steel"
              >
                Review us on Google <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="border border-zinc-200 bg-white p-6">
              <h3 className="font-heading text-lg font-bold uppercase">Ready to start your project?</h3>
              <p className="mt-2 text-sm font-light text-muted-deep">
                Join our satisfied customers with a bespoke gate designed for your property.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-[48px] items-center gap-2 bg-primary px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
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
              { name: 'Reviews', path: '/reviews' },
            ]),
          ),
        }}
      />

      {/* Schema: AggregateRating for LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${BUSINESS.website}/#business`,
            name: BUSINESS.legalName,
            url: BUSINESS.website,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: AGGREGATE_RATING.ratingValue,
              reviewCount: AGGREGATE_RATING.reviewCount,
              bestRating: AGGREGATE_RATING.bestRating,
              worstRating: AGGREGATE_RATING.worstRating,
            },
            review: REVIEWS.map((review) => ({
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: review.author,
              },
              datePublished: review.date,
              reviewRating: {
                '@type': 'Rating',
                ratingValue: review.rating,
                bestRating: 5,
                worstRating: 1,
              },
              name: review.title,
              reviewBody: review.text,
            })),
          }),
        }}
      />
    </MarketingShell>
  )
}
