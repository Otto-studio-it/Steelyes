'use client'

import { DimensionsStep } from '@/components/configurator/steps/DimensionsStep'
import { PostsStep } from '@/components/configurator/steps/PostsStep'
import { FencePanelsStep } from '@/components/configurator/steps/FencePanelsStep'

function ActSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="border-l-4 border-steel/20 pl-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-steel">{title}</h3>
        <p className="mt-1 text-sm text-muted-deep">{description}</p>
      </div>
      {children}
    </section>
  )
}

export function DefineActPanel() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-6 text-muted-deep">
        Set the opening size, mounting posts, and any matching fence panels. The preview and indicative price update
        as you adjust each value.
      </p>

      <ActSection title="Dimensions" description="Width and height of the gate opening in millimetres.">
        <DimensionsStep />
      </ActSection>

      <ActSection title="Mounting posts" description="Posts that frame the gate on site.">
        <PostsStep />
      </ActSection>

      <ActSection title="Fence panels" description="Optional panel runs alongside the gate.">
        <FencePanelsStep />
      </ActSection>
    </div>
  )
}
