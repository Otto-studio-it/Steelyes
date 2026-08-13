import { SocialLinks } from '@/components/marketing/SocialLinks'
import { cn } from '@/lib/utils'

type SocialFollowStripProps = {
  className?: string
  /** Compact layout for the mobile nav drawer. */
  compact?: boolean
  /** Dark backgrounds (home mosaic, about CTA). */
  tone?: 'light' | 'dark'
  title?: string
  body?: string
}

export function SocialFollowStrip({
  className,
  compact = false,
  tone = 'light',
  title = 'More project photos',
  body = 'See recent workshop and install photos on Instagram and TikTok.',
}: SocialFollowStripProps) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        compact
          ? 'border-t border-zinc-200 px-4 py-4'
          : 'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className={cn(compact && 'mb-1')}>
        <p
          className={cn(
            'font-heading font-bold uppercase tracking-tight',
            compact ? 'text-xs text-zinc-700' : 'text-sm',
            !compact && (isDark ? 'text-white' : 'text-steel'),
          )}
        >
          {compact ? 'Follow Steelyes' : title}
        </p>
        {!compact ? (
          <p className={cn('mt-1 max-w-md text-sm leading-relaxed', isDark ? 'text-white/70' : 'text-muted-deep')}>
            {body}
          </p>
        ) : (
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{body}</p>
        )}
      </div>
      <SocialLinks
        className={cn(compact ? '-ml-2.5' : '-ml-2.5 sm:ml-0')}
        iconClassName={
          isDark
            ? 'text-white/70 hover:text-white'
            : 'text-muted-deep hover:text-primary'
        }
      />
    </div>
  )
}
