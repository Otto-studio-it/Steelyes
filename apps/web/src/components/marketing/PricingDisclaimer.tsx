import { PRICING_DISCLAIMER } from '@/lib/marketing/business'
import { cn } from '@/lib/utils'

type PricingDisclaimerProps = {
  className?: string
  compact?: boolean
}

/** Single shared indicative-pricing disclaimer for gates, configurator, and quote. */
export function PricingDisclaimer({ className, compact = false }: PricingDisclaimerProps) {
  return (
    <p
      className={cn(
        'border-l-4 border-primary/50 bg-paper text-muted-deep',
        compact ? 'px-3 py-2 text-xs leading-5' : 'px-4 py-3 text-sm leading-6',
        className,
      )}
      data-testid="pricing-disclaimer"
    >
      {PRICING_DISCLAIMER}
    </p>
  )
}
