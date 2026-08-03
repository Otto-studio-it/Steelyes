'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { DimensionsStep } from '@/components/configurator/steps/DimensionsStep'
import { PostsStep } from '@/components/configurator/steps/PostsStep'
import { FencePanelsStep } from '@/components/configurator/steps/FencePanelsStep'
import { cn } from '@/lib/utils'
import { useConfiguratorActValidationIssues } from '@/store/configuratorStore'

export function DefineActPanel() {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const actValidationIssues = useConfiguratorActValidationIssues()
  const hasInstallIssue = actValidationIssues.some(
    (issue) => issue.field.startsWith('posts') || issue.field.startsWith('fencePanels'),
  )
  const showAdvanced = advancedOpen || hasInstallIssue

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted-deep">
        Set the opening size first. Posts and fence panels are optional — open Advanced install only if you need them.
      </p>

      <section className="space-y-4">
        <div className="border-l-4 border-steel/20 pl-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Dimensions</h3>
          <p className="mt-1 text-sm text-muted-deep">Width and height of the gate opening in millimetres.</p>
        </div>
        <DimensionsStep />
      </section>

      <div className="border border-steel/10 bg-white">
        <button
          type="button"
          aria-expanded={showAdvanced}
          aria-controls="define-advanced-install"
          onClick={() => setAdvancedOpen((open) => !open)}
          className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <span>
            <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
              Advanced install
            </span>
            <span className="mt-0.5 block text-sm text-muted-deep">
              {hasInstallIssue
                ? 'Needs your attention before you can continue.'
                : 'Mounting posts and matching fence panels'}
            </span>
          </span>
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-muted transition-transform', showAdvanced && 'rotate-180')}
            aria-hidden
          />
        </button>

        {showAdvanced ? (
          <div id="define-advanced-install" className="space-y-8 border-t border-steel/10 px-4 py-5">
            <section className="space-y-4">
              <div className="border-l-4 border-steel/20 pl-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Mounting posts</h3>
                <p className="mt-1 text-sm text-muted-deep">Posts that frame the gate on site.</p>
              </div>
              <PostsStep />
            </section>

            <section className="space-y-4">
              <div className="border-l-4 border-steel/20 pl-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Fence panels</h3>
                <p className="mt-1 text-sm text-muted-deep">Optional panel runs alongside the gate.</p>
              </div>
              <FencePanelsStep />
            </section>
          </div>
        ) : null}
      </div>
    </div>
  )
}
