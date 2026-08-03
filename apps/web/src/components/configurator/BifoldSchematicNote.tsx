'use client'

import {
  bifoldSchematicNote,
  getBifoldPanelCount,
  getBifoldPanelsPerLeaf,
  isBifoldGate,
  type GateType,
} from '@steelyes/gate-engine'

type BifoldSchematicNoteProps = {
  gateType: GateType
}

/** CA-09 / CA-10 confirmed bifold fold layout. */
export function BifoldSchematicNote({ gateType }: BifoldSchematicNoteProps) {
  if (!isBifoldGate(gateType)) {
    return null
  }

  const panels = getBifoldPanelCount(gateType)
  const perLeaf = getBifoldPanelsPerLeaf(gateType)

  return (
    <aside
      className="border-l-4 border-primary/50 bg-paper px-4 py-3"
      data-testid="bifold-schematic-note"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Bifold layout</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        <strong className="font-semibold text-steel">{panels} folding panels</strong> ({perLeaf} per leaf, equal
        50/50 split).
        {gateType === 'single_bifolding'
          ? ' Stack collects on the hinge side — left or right handing is chosen at quote (preview shows hinge-left).'
          : null}
      </p>
      <p className="mt-2 font-mono text-[10px] leading-4 text-muted">{bifoldSchematicNote(gateType)}</p>
    </aside>
  )
}
