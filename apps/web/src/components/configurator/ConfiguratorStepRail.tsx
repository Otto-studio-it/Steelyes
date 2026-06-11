'use client'

import { Check, ChevronLeft } from 'lucide-react'

import { CONFIGURATOR_STEPS } from '@/lib/configurator/constants'
import { useConfiguratorStore, useConfiguratorStep } from '@/store/configuratorStore'

export function ConfiguratorStepRail() {
  const { stepIndex, step, isFirst, totalSteps } = useConfiguratorStep()
  const setStepIndex = useConfiguratorStore((state) => state.setStepIndex)
  const prevStep = useConfiguratorStore((state) => state.prevStep)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
            Step {stepIndex + 1} of {totalSteps} · {step.shortLabel}
          </p>
          <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight text-steel sm:text-2xl">
            {step.label}
          </h2>
        </div>
        {!isFirst ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-full border border-steel/12 bg-white px-4 font-heading text-xs font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}
      </div>

      <div className="flex items-end gap-2">
        {CONFIGURATOR_STEPS.map((item, index) => {
          const active = index === stepIndex
          const complete = index < stepIndex

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStepIndex(index)}
              className="group flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-end gap-1.5 rounded-xl px-1 py-2 transition"
              aria-current={active ? 'step' : undefined}
              aria-label={`${item.label}${active ? ', current step' : complete ? ', completed' : ''}`}
            >
              {complete ? (
                <Check className="h-3.5 w-3.5 text-steel" aria-hidden />
              ) : (
                <span className="h-3.5" aria-hidden />
              )}
              <span
                className={`h-1.5 w-full rounded-full transition ${
                  active ? 'bg-primary' : complete ? 'bg-steel' : 'bg-steel/15 group-hover:bg-steel/25'
                }`}
              />
              <span
                className={`truncate font-mono text-[9px] uppercase tracking-widest ${
                  active ? 'text-primary' : complete ? 'text-steel' : 'text-muted'
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
