'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { CONFIGURATOR_QUOTE_FORM_ID } from '@/components/configurator/ConfiguratorQuoteRequestForm'
import { PriceDeltaChip } from '@/components/configurator/PriceDeltaChip'
import { usePriceDeltaFlash } from '@/hooks/usePriceDeltaFlash'
import { formatPricingBarAmount, formatPricingBarHeadline } from '@/lib/configurator/labels'
import { QUICK_PATH_STEP_COUNT } from '@/lib/configurator/navigation'
import { useConfiguratorPricing, useConfiguratorQuickStep, useConfiguratorStore } from '@/store/configuratorStore'

/**
 * Compact bottom action bar for the Quick Path. Drives nextQuickStep/prevQuickStep
 * and swaps Continue for the quote handoff on the final step. Publishes the measured
 * height as --cfg-actionbar-h (same contract as the studio compact bar).
 */
export function MobileQuickActionBar() {
  const pricing = useConfiguratorPricing()
  const step = useConfiguratorQuickStep()
  // Client request: amounts only on the final quote step.
  const priceRevealed = step === QUICK_PATH_STEP_COUNT - 1
  const priceDeltaFlash = usePriceDeltaFlash(priceRevealed ? pricing.totalGbp : null)
  const nextQuickStep = useConfiguratorStore((state) => state.nextQuickStep)
  const quoteSubmitted = useConfiguratorStore((state) => state.quoteSubmitted)
  const quoteSubmitting = useConfiguratorStore((state) => state.quoteSubmitting)
  const barRef = useRef<HTMLDivElement>(null)

  // Defer to the browser history stack so the in-app Back and the system Back
  // share one model (the shell's popstate handler runs prevQuickStep).
  const goBack = () => window.history.back()

  const isFirst = step === 0
  const isLast = step === QUICK_PATH_STEP_COUNT - 1

  useEffect(() => {
    const node = barRef.current
    if (!node) return

    const root = document.documentElement
    const publish = () => root.style.setProperty('--cfg-actionbar-h', `${node.offsetHeight}px`)
    publish()

    const observer = new ResizeObserver(publish)
    observer.observe(node)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--cfg-actionbar-h')
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-steel/10 bg-white/98 backdrop-blur-md lg:hidden"
      data-testid="configurator-action-bar"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 pt-2.5">
        <div className="flex-1 min-w-0">
          {priceRevealed ? (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {formatPricingBarHeadline(pricing)}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="font-heading text-lg font-black uppercase tracking-tight text-steel tabular-nums">
                  {formatPricingBarAmount(pricing)}
                </p>
                <PriceDeltaChip label={priceDeltaFlash} />
              </div>
            </>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Price at final step
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          {!isFirst ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-[48px] items-center justify-center border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Back
            </button>
          ) : null}

          {isLast ? (
            <button
              type="submit"
              form={CONFIGURATOR_QUOTE_FORM_ID}
              disabled={quoteSubmitted || quoteSubmitting}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
            >
              {quoteSubmitted ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Request sent
                </>
              ) : quoteSubmitting ? (
                'Sending…'
              ) : (
                <>
                  Request quote
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuickStep}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
