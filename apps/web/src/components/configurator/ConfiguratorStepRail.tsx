'use client'

import { ChevronLeft } from 'lucide-react'

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
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9E000C]">
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight text-[#1B1C1A]">
            {step.label}
          </h2>
        </div>
        {!isFirst ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-full border border-[#1B1C1A]/12 bg-white px-4 font-heading text-xs font-bold uppercase tracking-tight text-[#1B1C1A] transition hover:border-[#9E000C]/30 hover:text-[#9E000C]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {CONFIGURATOR_STEPS.map((item, index) => {
          const active = index === stepIndex
          const complete = index < stepIndex
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStepIndex(index)}
              className="group flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition"
              aria-current={active ? 'step' : undefined}
              aria-label={`${item.label}${active ? ', current step' : complete ? ', completed' : ''}`}
            >
              <span
                className={`h-1.5 w-full rounded-full transition ${
                  active ? 'bg-[#9E000C]' : complete ? 'bg-[#1B1C1A]' : 'bg-[#E8E4DD] group-hover:bg-[#D8D2CB]'
                }`}
              />
              <span
                className={`hidden font-mono text-[9px] uppercase tracking-widest sm:block ${
                  active ? 'text-[#9E000C]' : 'text-[#8A807B]'
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
