'use client'

import { DraftingCompass, ShieldCheck } from 'lucide-react'

import { ConfiguratorOrientationHint } from '@/components/configurator/ConfiguratorOrientationHint'
import { ConfiguratorPreviewPanel } from '@/components/configurator/ConfiguratorPreviewPanel'
import { ConfiguratorPriceBar } from '@/components/configurator/ConfiguratorPriceBar'
import { ConfiguratorPriceSummary } from '@/components/configurator/ConfiguratorPriceSummary'
import { ConfiguratorStepRail } from '@/components/configurator/ConfiguratorStepRail'
import { DimensionsStep } from '@/components/configurator/steps/DimensionsStep'
import { FencePanelsStep } from '@/components/configurator/steps/FencePanelsStep'
import { GateSetupStep } from '@/components/configurator/steps/GateSetupStep'
import { OptionsStep } from '@/components/configurator/steps/OptionsStep'
import { PostsStep } from '@/components/configurator/steps/PostsStep'
import { SummaryStep } from '@/components/configurator/steps/SummaryStep'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { CONFIGURATOR_STEPS } from '@/lib/configurator/constants'
import type { TenantBundle } from '@steelyes/gate-engine'
import {
  useConfiguratorConfig,
  useConfiguratorStep,
  useConfiguratorStepValidationIssues,
  useConfiguratorStore,
  useConfiguratorValidationIssues,
} from '@/store/configuratorStore'

const MOBILE_PRICE_BAR_OFFSET = 'calc(9rem + env(safe-area-inset-bottom))'
const STICKY_PREVIEW_TOP = 'calc(3.5rem + env(safe-area-inset-top, 0px))'

function StepPanel() {
  const { step } = useConfiguratorStep()

  switch (step.id) {
    case 'gate':
      return <GateSetupStep />
    case 'dimensions':
      return <DimensionsStep />
    case 'posts':
      return <PostsStep />
    case 'options':
      return <OptionsStep />
    case 'fence':
      return <FencePanelsStep />
    case 'summary':
      return <SummaryStep />
    default:
      return null
  }
}

function StepCard() {
  const { stepIndex, isFirst, isLast, step } = useConfiguratorStep()
  const nextStep = useConfiguratorStore((state) => state.nextStep)
  const prevStep = useConfiguratorStore((state) => state.prevStep)
  const stepValidationIssues = useConfiguratorStepValidationIssues()
  const summaryValidationIssues = useConfiguratorValidationIssues()
  const validationIssues = step.id === 'summary' ? summaryValidationIssues : stepValidationIssues
  const blocked = validationIssues.length > 0

  return (
    <div className="rounded-[24px] border border-steel/10 bg-white/90 p-4 shadow-[0_14px_40px_rgba(25,20,18,0.06)] sm:p-5">
      <ConfiguratorStepRail />
      <div key={CONFIGURATOR_STEPS[stepIndex].id} className="mt-5">
        <StepPanel />
      </div>

      {blocked && !isLast ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Resolve before continuing
          </p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-deep">
            {validationIssues.slice(0, 3).map((issue) => (
              <li key={`${issue.field}:${issue.code}`}>{issue.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 hidden items-center justify-end gap-3 lg:flex">
        {!isFirst ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
          >
            Back
          </button>
        ) : null}
        {!isLast ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={blocked}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-steel px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        ) : null}
      </div>
    </div>
  )
}

function DesktopHero() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Gate configurator</p>
      <h1 className="mt-2 text-balance font-heading text-[clamp(1.85rem,5vw,4.9rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-steel">
        Design your gate installation.
      </h1>
      <p className="mt-3 hidden max-w-2xl text-base leading-7 text-muted-deep sm:block lg:mt-5 lg:text-lg">
        Configure mechanism, dimensions, mounting posts, and options with a live installation preview — similar
        to professional gate design tools.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Indicative pricing
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-steel/12 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
          <DraftingCompass className="h-3.5 w-3.5" aria-hidden />
          Live installation preview
        </span>
      </div>
    </div>
  )
}

export function ConfiguratorShell({ embed = false, tenant }: { embed?: boolean; tenant?: TenantBundle }) {
  const config = useConfiguratorConfig()
  const viewport = useConfiguratorViewport()
  const isDesktop = viewport.mode === 'desktop'
  const isLandscapePhone = viewport.isLandscapePhone

  const safeAreaX =
    'supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]'

  if (isLandscapePhone) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(158,0,12,0.14),transparent_36%),radial-gradient(circle_at_top_right,rgba(121,89,22,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(245,243,240,0))]" />

        <section className={`mx-auto max-w-7xl px-4 py-4 ${safeAreaX}`} style={{ paddingBottom: MOBILE_PRICE_BAR_OFFSET }}>
          <div className="grid grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] items-start gap-4">
            <div className="sticky self-start" style={{ top: STICKY_PREVIEW_TOP }}>
              <ConfiguratorPreviewPanel config={config} pinned tenant={tenant} />
            </div>
            <StepCard />
          </div>
        </section>

        <ConfiguratorPriceBar />
      </div>
    )
  }

  if (!isDesktop) {
    return (
      <div className="relative">
        <div
          className={`sticky z-30 border-b border-steel/10 bg-canvas/98 backdrop-blur-md ${safeAreaX}`}
          style={{ top: STICKY_PREVIEW_TOP }}
        >
          <div className="mx-auto max-w-7xl px-4 py-3">
            <ConfiguratorPreviewPanel config={config} pinned tenant={tenant} />
          </div>
        </div>

        <section className={`mx-auto max-w-7xl px-4 py-4 ${safeAreaX}`} style={{ paddingBottom: MOBILE_PRICE_BAR_OFFSET }}>
          {viewport.mode === 'portrait-phone' ? (
            <div className="mb-4">
              <ConfiguratorOrientationHint />
            </div>
          ) : null}
          <StepCard />
        </section>

        <ConfiguratorPriceBar />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px] bg-[radial-gradient(circle_at_top_left,rgba(158,0,12,0.14),transparent_36%),radial-gradient(circle_at_top_right,rgba(121,89,22,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(245,243,240,0))]" />

      <section className={`mx-auto max-w-7xl px-4 py-8 lg:px-8 ${embed ? 'py-4 lg:py-6' : 'lg:py-12'} ${safeAreaX}`}>
        {embed ? null : <DesktopHero />}

        <div className={`grid items-start gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] ${embed ? 'mt-4' : 'mt-10'}`}>
          <div className="sticky top-24 self-start">
            <ConfiguratorPreviewPanel config={config} pinned tenant={tenant} />
          </div>

          <div className="space-y-6">
            <StepCard />
            <ConfiguratorPriceSummary />
          </div>
        </div>
      </section>
    </div>
  )
}
