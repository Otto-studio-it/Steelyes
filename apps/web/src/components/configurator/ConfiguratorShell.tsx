'use client'

import { DraftingCompass, ShieldCheck } from 'lucide-react'

import { ConfiguratorOrientationHint } from '@/components/configurator/ConfiguratorOrientationHint'
import { ConfiguratorPreviewPanel } from '@/components/configurator/ConfiguratorPreviewPanel'
import { ConfiguratorPriceBar } from '@/components/configurator/ConfiguratorPriceBar'
import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { ConfiguratorStepRail } from '@/components/configurator/ConfiguratorStepRail'
import { DimensionsStep } from '@/components/configurator/steps/DimensionsStep'
import { GateSetupStep } from '@/components/configurator/steps/GateSetupStep'
import { OptionsStep } from '@/components/configurator/steps/OptionsStep'
import { SummaryStep } from '@/components/configurator/steps/SummaryStep'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { CONFIGURATOR_STEPS } from '@/lib/configurator/constants'
import { useConfiguratorConfig, useConfiguratorStep, useConfiguratorStore } from '@/store/configuratorStore'

function StepPanel() {
  const { step } = useConfiguratorStep()

  switch (step.id) {
    case 'gate':
      return <GateSetupStep />
    case 'dimensions':
      return <DimensionsStep />
    case 'options':
      return <OptionsStep />
    case 'summary':
      return <SummaryStep />
    default:
      return null
  }
}

function StepCard({ showOrientationHint }: { showOrientationHint: boolean }) {
  const { stepIndex, isFirst, isLast } = useConfiguratorStep()
  const nextStep = useConfiguratorStore((state) => state.nextStep)
  const prevStep = useConfiguratorStore((state) => state.prevStep)

  return (
    <div className="rounded-[24px] border border-[#1B1C1A]/10 bg-white/90 p-4 shadow-[0_14px_40px_rgba(25,20,18,0.06)] sm:p-5">
      {showOrientationHint ? (
        <div className="mb-4">
          <ConfiguratorOrientationHint />
        </div>
      ) : null}
      <ConfiguratorStepRail />
      <div key={CONFIGURATOR_STEPS[stepIndex].id} className="mt-5">
        <StepPanel />
      </div>

      <div className="mt-6 hidden items-center justify-end gap-3 lg:flex">
        {!isFirst ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#1B1C1A]/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A] transition hover:border-[#9E000C]/30 hover:text-[#9E000C]"
          >
            Back
          </button>
        ) : null}
        {!isLast ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1B1C1A] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-[#9E000C]"
          >
            Continue
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function ConfiguratorShell() {
  const config = useConfiguratorConfig()
  const viewport = useConfiguratorViewport()
  const isLandscapePhone = viewport.isLandscapePhone
  const isPortraitPhone = viewport.isPortraitPhone

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(158,0,12,0.14),transparent_36%),radial-gradient(circle_at_top_right,rgba(121,89,22,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(245,243,240,0))] lg:h-[440px]" />

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9E000C]">
            Configurator · mobile first
          </p>
          <h1 className="mt-2 text-balance font-heading text-[clamp(1.85rem,6vw,4.9rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#1B1C1A]">
            Configure your gate in clear steps.
          </h1>
          <p className="mt-3 hidden max-w-2xl text-base leading-7 text-[#4B403C] sm:block lg:mt-5 lg:text-lg">
            Preview, pricing, and summary stay connected as you move through the flow. The first release slice is
            calibrated around double swing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#9E000C]/18 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E000C]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Indicative pricing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1B1C1A]/12 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B1C1A]">
              <DraftingCompass className="h-3.5 w-3.5" aria-hidden />
              2D preview
            </span>
          </div>
        </div>

        {isLandscapePhone ? (
          <div className="mt-6 grid grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] items-start gap-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
            <div className="sticky top-4 self-start">
              <ConfiguratorPreviewPanel config={config} compact />
            </div>
            <StepCard showOrientationHint={false} />
          </div>
        ) : (
          <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
            <div className="space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-0">
              {isPortraitPhone ? (
                <ConfiguratorPreviewPanel config={config} compact collapsible />
              ) : null}

              <StepCard showOrientationHint={isPortraitPhone} />
            </div>

            <div className="hidden space-y-6 lg:sticky lg:top-6 lg:block lg:self-start">
              <ConfiguratorPreviewPanel config={config} />
              <ConfiguratorPriceSummary />
            </div>
          </div>
        )}
      </section>

      <ConfiguratorPriceBar />
    </div>
  )
}
