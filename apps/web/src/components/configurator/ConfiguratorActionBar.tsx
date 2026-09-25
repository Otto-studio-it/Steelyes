'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { CONFIGURATOR_QUOTE_FORM_ID } from '@/components/configurator/ConfiguratorQuoteRequestForm'
import { PriceDeltaChip } from '@/components/configurator/PriceDeltaChip'
import { usePriceDeltaFlash } from '@/hooks/usePriceDeltaFlash'
import { formatPricingDisplayAmount, formatPricingDisplayHeadline } from '@/lib/configurator/labels'
import {
  useConfiguratorAct,
  useConfiguratorActValidationIssues,
  useConfiguratorPricing,
  useConfiguratorStore,
  useConfiguratorValidationIssues,
} from '@/store/configuratorStore'

type ConfiguratorActionBarProps = {
  className?: string
  variant?: 'fixed' | 'inline' | 'compact'
}

export function ConfiguratorActionBar({ className = '', variant = 'fixed' }: ConfiguratorActionBarProps) {
  const pricing = useConfiguratorPricing()
  const priceDeltaFlash = usePriceDeltaFlash(pricing.totalGbp)
  const { isFirst, isLast, act } = useConfiguratorAct()
  const nextAct = useConfiguratorStore((state) => state.nextAct)
  const prevAct = useConfiguratorStore((state) => state.prevAct)
  const quoteSubmitted = useConfiguratorStore((state) => state.quoteSubmitted)
  const quoteSubmitting = useConfiguratorStore((state) => state.quoteSubmitting)
  const actValidationIssues = useConfiguratorActValidationIssues()
  const summaryValidationIssues = useConfiguratorValidationIssues()
  const validationIssues = act.id === 'summary' ? summaryValidationIssues : actValidationIssues
  const blocked = validationIssues.length > 0

  const isFloating = variant === 'fixed' || variant === 'compact'
  const copyVariant = isFloating ? 'mobile' : 'desktop'
  const barRef = useRef<HTMLDivElement>(null)

  // Publish the real bar height so the scroll container can reserve exactly the
  // right bottom inset (replaces the fixed 9rem magic number).
  useEffect(() => {
    if (!isFloating) return
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
  }, [isFloating])

  const pricingBlock = (
    <div className="flex-1 min-w-0">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {formatPricingDisplayHeadline(pricing, copyVariant)}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="font-heading text-xl font-black uppercase tracking-tight text-steel tabular-nums">
          {formatPricingDisplayAmount(pricing, copyVariant)}
        </p>
        <PriceDeltaChip label={priceDeltaFlash} />
      </div>
    </div>
  )

  const compactPricingBlock = (
    <div className="flex-1 min-w-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {formatPricingDisplayHeadline(pricing, 'mobile')}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="font-heading text-lg font-black uppercase tracking-tight text-steel tabular-nums">
          {formatPricingDisplayAmount(pricing, 'mobile')}
        </p>
        <PriceDeltaChip label={priceDeltaFlash} />
      </div>
    </div>
  )

  const focusValidationAlert = () => {
    const alert = document.getElementById('cfg-act-validation')
    if (!alert) return
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    alert.focus()
  }

  const actions = (
    <div className="flex items-center gap-3">
      {!isFirst ? (
        <button
          type="button"
          onClick={prevAct}
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
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 sm:flex-none"
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
          onClick={() => {
            if (blocked) {
              focusValidationAlert()
              return
            }
            nextAct()
          }}
          aria-disabled={blocked}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-disabled:opacity-50 sm:flex-none"
        >
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  )

  if (variant === 'inline') {
    return (
      <div className={`border-t border-steel/10 pt-5 ${className}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {pricingBlock}
          {actions}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        ref={barRef}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-steel/10 bg-white/98 backdrop-blur-md ${className}`}
        data-testid="configurator-action-bar"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))',
        }}
      >
      <div className="mx-auto flex max-w-7xl items-center gap-3 pt-2.5">
        {compactPricingBlock}
        <div className="flex-shrink-0">{actions}</div>
      </div>
      </div>
    )
  }

  return (
    <div
      ref={barRef}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-steel/10 bg-white/98 backdrop-blur-md ${className}`}
      data-testid="configurator-action-bar"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
    <div className="mx-auto flex max-w-7xl flex-col pt-3">
      {pricingBlock}
      <div className="mt-3">{actions}</div>
    </div>
    </div>
  )
}
