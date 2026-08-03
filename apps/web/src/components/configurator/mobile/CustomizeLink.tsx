'use client'

import { ChevronRight } from 'lucide-react'

import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import type { ConfiguratorActId } from '@/lib/configurator/navigation'
import { useConfiguratorStore } from '@/store/configuratorStore'

type CustomizeLinkProps = {
  label: string
  targetAct: ConfiguratorActId
  fromStep: number
}

/** Switches from Quick Path to the full Design Studio, preserving the live config. */
export function CustomizeLink({ label, targetAct, fromStep }: CustomizeLinkProps) {
  const setFlowMode = useConfiguratorStore((state) => state.setFlowMode)
  const goToAct = useConfiguratorStore((state) => state.goToAct)

  return (
    <button
      type="button"
      onClick={() => {
        captureConfiguratorEvent('customize all tapped', { from_step: fromStep })
        setFlowMode('studio')
        goToAct(targetAct)
      }}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-1 border border-steel/12 bg-white px-4 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
    </button>
  )
}
