'use client'

import { QUICK_PATH_STEP_COUNT } from '@/lib/configurator/navigation'

const STEP_TITLES = ['Your gate', 'Your opening', 'Ready for quote']

/** Linear "Step 1 of 3" indicator for the mobile Quick Path (multi-step-progress). */
export function MobileQuickProgress({ step }: { step: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          Step {step + 1} of {QUICK_PATH_STEP_COUNT}
        </p>
        <p className="truncate font-heading text-sm font-bold uppercase tracking-tight text-steel">
          {STEP_TITLES[step]}
        </p>
      </div>
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={QUICK_PATH_STEP_COUNT}
        aria-label={`Quick path step ${step + 1} of ${QUICK_PATH_STEP_COUNT}`}
      >
        {Array.from({ length: QUICK_PATH_STEP_COUNT }).map((_, index) => (
          <span
            key={index}
            className={`h-1 flex-1 ${index <= step ? 'bg-primary' : 'bg-steel/15'}`}
          />
        ))}
      </div>
    </div>
  )
}
