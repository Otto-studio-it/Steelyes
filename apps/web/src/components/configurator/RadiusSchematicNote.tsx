'use client'

import type { GateType } from '@steelyes/gate-engine'

type RadiusSchematicNoteProps = {
  gateType: GateType
}

/** CA-12: travel path always curved; top straight or curved via arched top. */
export function RadiusSchematicNote({ gateType }: RadiusSchematicNoteProps) {
  if (gateType !== 'radius_sliding') {
    return null
  }

  return (
    <aside
      className="border-l-4 border-primary/50 bg-paper px-4 py-3"
      data-testid="radius-schematic-note"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Radius layout</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        Travel path is always <strong className="font-semibold text-steel">curved</strong>. Top profile may be
        straight or curved — use arched top for a curved crest. This is not a straight-track sliding gate.
      </p>
    </aside>
  )
}
