'use client'

import {
  getTelescopicOverlapMm,
  getTelescopicPanelCount,
  TELESCOPIC_OVERLAP_MM_MAX,
  TELESCOPIC_OVERLAP_MM_MIN,
  type GateType,
} from '@steelyes/gate-engine'

type TelescopicSchematicNoteProps = {
  gateType: GateType
  clearOpeningMm: number
}

/** CA-11 telescopic panel / overlap honesty. */
export function TelescopicSchematicNote({ gateType, clearOpeningMm }: TelescopicSchematicNoteProps) {
  if (gateType !== 'telescopic_sliding') {
    return null
  }

  const panels = getTelescopicPanelCount()
  const overlap = getTelescopicOverlapMm(clearOpeningMm)

  return (
    <aside
      className="border-l-4 border-primary/50 bg-paper px-4 py-3"
      data-testid="telescopic-schematic-note"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Telescopic layout</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        Schematic: <strong className="font-semibold text-steel">{panels} panels</strong>, overlap about{' '}
        {TELESCOPIC_OVERLAP_MM_MIN}–{TELESCOPIC_OVERLAP_MM_MAX} mm (drawing uses {overlap} mm). Front face ={' '}
        <strong className="font-semibold text-steel">motor-side</strong> panel.
      </p>
    </aside>
  )
}
