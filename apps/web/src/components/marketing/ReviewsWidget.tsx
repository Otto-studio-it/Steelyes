import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

export type ReviewSnippet = {
  author: string
  location: string
  rating: number
  text: string
}

const FEATURED_REVIEWS: ReviewSnippet[] = [
  {
    author: 'James M.',
    location: 'Dulwich, SE21',
    rating: 5,
    text: 'From the initial survey to final installation, Steelyes exceeded our expectations. The Victorian-style gates perfectly complement our Edwardian property.',
  },
  {
    author: 'Sarah & David K.',
    location: 'Bromley, BR1',
    rating: 5,
    text: 'We needed sliding gates due to our sloped driveway, and Steelyes engineered the perfect solution. The automation works flawlessly.',
  },
  {
    author: 'Michael T.',
    location: 'Greenwich, SE10',
    rating: 5,
    text: 'Got quotes from three companies. Steelyes wasn\'t the cheapest but they were the most thorough. Final price matched the quote exactly.',
  },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? 'fill-primary text-primary' : 'fill-zinc-200 text-zinc-200'}`}
        />
      ))}
    </div>
  )
}

type ReviewsWidgetProps = {
  variant?: 'light' | 'dark'
  showCTA?: boolean
  maxReviews?: number
  className?: string
}

export function ReviewsWidget({
  variant = 'light',
  showCTA = true,
  maxReviews = 3,
  className = '',
}: ReviewsWidgetProps) {
  const reviews = FEATURED_REVIEWS.slice(0, maxReviews)
  const isDark = variant === 'dark'

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className={`font-mono text-xs uppercase tracking-widest ${isDark ? 'text-primary' : 'text-primary'}`}>
            Customer reviews
          </p>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={5} size="md" />
            <span className={`font-mono text-sm ${isDark ? 'text-white/70' : 'text-zinc-500'}`}>
              4.8 out of 5 · 6 reviews
            </span>
          </div>
        </div>
        {showCTA && (
          <Link
            href="/reviews"
            className={`hidden items-center gap-1 font-heading text-sm font-bold uppercase sm:inline-flex ${
              isDark ? 'text-white hover:text-primary' : 'text-primary hover:underline'
            }`}
          >
            All reviews <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`p-5 ${isDark ? 'border border-white/10 bg-white/5' : 'border border-zinc-200 bg-white'}`}
          >
            <StarRating rating={review.rating} />
            <p className={`mt-3 line-clamp-3 text-sm font-light leading-relaxed ${isDark ? 'text-white/80' : 'text-muted-deep'}`}>
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="mt-4 border-t border-zinc-100/20 pt-3">
              <p className={`font-heading text-sm font-bold ${isDark ? 'text-white' : 'text-steel'}`}>
                {review.author}
              </p>
              <p className={`font-mono text-xs ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                {review.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showCTA && (
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/reviews"
            className={`inline-flex items-center gap-2 font-heading text-sm font-bold uppercase ${
              isDark ? 'text-white hover:text-primary' : 'text-primary hover:underline'
            }`}
          >
            Read all reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

/**
 * Compact rating display for header/footer use
 */
export function RatingBadge({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/reviews"
      className={`inline-flex items-center gap-2 transition-colors hover:text-primary ${className}`}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-3.5 w-3.5 fill-primary text-primary" />
        ))}
      </div>
      <span className="font-mono text-xs">4.8/5 (6 reviews)</span>
    </Link>
  )
}
