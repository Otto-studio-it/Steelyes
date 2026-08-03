'use client'

type PriceDeltaChipProps = {
  label: string | null
  /** Static hint on option rows vs live flash after a change */
  tone?: 'flash' | 'hint'
  className?: string
}

export function PriceDeltaChip({ label, tone = 'flash', className = '' }: PriceDeltaChipProps) {
  if (!label) return null

  const positive = label.startsWith('+')
  const survey = label === 'Survey'

  return (
    <span
      aria-live={tone === 'flash' ? 'polite' : undefined}
      className={`inline-flex min-h-[28px] items-center border px-2 font-mono text-[10px] uppercase tracking-widest tabular-nums ${
        survey
          ? 'border-steel/20 bg-paper text-muted'
          : positive
            ? 'border-primary/25 bg-primary/5 text-primary'
            : 'border-steel/20 bg-paper text-steel'
      } ${className}`}
    >
      {label}
    </span>
  )
}
