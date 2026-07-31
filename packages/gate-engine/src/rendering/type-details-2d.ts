/**
 * Per-gate-type 2D elevation overlays — intake 2026-07-26 + CA batch.
 * Keeps buildSwingFrame / buildSlidingFrame readable; call after core panels.
 */

import type { GateConfig } from '../types'
import { TRACKED_RUNBACK_EXTRA_MM } from '../rules/ship-defaults'
import { getTelescopicPanelCount } from '../rules/telescopic'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateRenderPrimitive } from './render-plan'

type DetailPalette = {
  ink: string
  accent: string
  accentSoft: string
  steel: string
  panelSoft: string
  postFill: string
}

type SlidingLayout = {
  frameX: number
  frameY: number
  frameWidth: number
  frameHeight: number
  panelX: number
  panelY: number
  panelWidth: number
  panelHeight: number
  trackY: number
  tailWidth: number
}

function scaleVisual(value: number): number {
  return scaleVisualBoldness(value)
}

/** Tracked: bottom box ~10 mm above track, runback +350, mid guide post. Track line stays in buildSlidingFrame. */
export function pushTrackedSlidingDetails(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  layout: SlidingLayout,
  clearOpeningMm: number,
): void {
  const { frameX, panelX, panelY, panelWidth, panelHeight, trackY } = layout

  // Bottom box sitting ~10 mm above track (schematic).
  primitives.push({
    kind: 'rect',
    id: 'tracked-bottom-box',
    x: panelX + 8,
    y: trackY - 18,
    width: panelWidth - 16,
    height: 14,
    rx: 2,
    fill: palette.postFill,
    stroke: palette.ink,
    strokeWidth: scaleVisual(2.2),
    fillOpacity: 0.95,
  })

  // Runback / rack zone beyond opening (parking side = left of panel when panel parks right).
  const runbackPx = Math.max(
    36,
    (TRACKED_RUNBACK_EXTRA_MM / Math.max(clearOpeningMm, 1)) * panelWidth,
  )
  const runbackX = Math.max(frameX + 20, panelX - runbackPx)
  primitives.push({
    kind: 'rect',
    id: 'tracked-runback-zone',
    x: runbackX,
    y: panelY + 12,
    width: Math.max(24, panelX - runbackX),
    height: panelHeight - 24,
    rx: 6,
    fill: 'none',
    stroke: palette.accent,
    strokeWidth: scaleVisual(2),
    strokeDasharray: '8 7',
    opacity: 0.7,
  })

  // Motor schematic in runback.
  primitives.push({
    kind: 'rect',
    id: 'tracked-motor',
    x: runbackX + 8,
    y: panelY + panelHeight * 0.55,
    width: Math.min(52, Math.max(28, runbackPx * 0.45)),
    height: 36,
    rx: 4,
    fill: palette.accentSoft,
    stroke: palette.ink,
    strokeWidth: scaleVisual(2),
    fillOpacity: 0.85,
  })

  // Anti-lift mid-height guide post (intake: half-height OK).
  const guideX = panelX - 14
  primitives.push({
    kind: 'rect',
    id: 'tracked-guide-post',
    x: guideX,
    y: panelY + panelHeight * 0.35,
    width: 12,
    height: panelHeight * 0.45,
    rx: 2,
    fill: palette.postFill,
    stroke: palette.ink,
    strokeWidth: scaleVisual(2),
  })
  primitives.push({
    kind: 'circle',
    id: 'tracked-guide-wheel-a',
    cx: guideX + 6,
    cy: panelY + panelHeight * 0.48,
    r: scaleVisual(4),
    fill: '#FAFAFA',
    stroke: palette.ink,
    strokeWidth: scaleVisual(1.5),
  })
  primitives.push({
    kind: 'circle',
    id: 'tracked-guide-wheel-b',
    cx: guideX + 6,
    cy: panelY + panelHeight * 0.62,
    r: scaleVisual(4),
    fill: '#FAFAFA',
    stroke: palette.ink,
    strokeWidth: scaleVisual(1.5),
  })
}

/** Cantilever: bottom box 100×50 cue, ground guide 60×70, carriage marks, full support. */
export function pushCantileverSlidingDetails(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  layout: SlidingLayout,
): void {
  const { frameX, panelX, panelY, panelWidth, panelHeight, trackY, tailWidth } = layout
  const leafX = panelX
  const leafW = panelWidth

  primitives.push({
    kind: 'rect',
    id: 'cantilever-bottom-box',
    x: leafX + 6,
    y: trackY - 20,
    width: leafW + Math.max(0, tailWidth - 20),
    height: 16,
    rx: 2,
    fill: palette.postFill,
    stroke: palette.ink,
    strokeWidth: scaleVisual(2.4),
  })

  // Ground guide channel under parking side / carriage zone.
  primitives.push({
    kind: 'rect',
    id: 'cantilever-ground-guide',
    x: frameX + 28,
    y: trackY + 2,
    width: Math.max(tailWidth, 80),
    height: 14,
    rx: 2,
    fill: 'none',
    stroke: palette.accent,
    strokeWidth: scaleVisual(2.5),
    strokeDasharray: '5 4',
    opacity: 0.85,
  })

  // Carriage rollers under the join (schematic).
  const joinX = frameX + 28 + tailWidth
  for (const offset of [-18, 0, 18]) {
    primitives.push({
      kind: 'circle',
      id: `cantilever-carriage-${offset}`,
      cx: joinX + offset,
      cy: trackY - 4,
      r: scaleVisual(5),
      fill: '#FAFAFA',
      stroke: palette.ink,
      strokeWidth: scaleVisual(1.8),
    })
  }

  // Foundation strip under tail (300 mm wide cue — schematic length).
  primitives.push({
    kind: 'rect',
    id: 'cantilever-foundation',
    x: frameX + 20,
    y: trackY + 18,
    width: Math.max(tailWidth + 24, 100),
    height: 10,
    rx: 1,
    fill: palette.steel,
    stroke: 'none',
    fillOpacity: 0.35,
  })
}

/** Telescopic: motor-side front panel marker + stack thickness cue (intake 160 mm). */
export function pushTelescopicSlidingDetails(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  layout: SlidingLayout,
): void {
  const { panelX, panelY, panelHeight } = layout

  primitives.push({
    kind: 'line',
    id: 'telescopic-motor-side-marker',
    x1: panelX + 10,
    y1: panelY + 20,
    x2: panelX + 10,
    y2: panelY + panelHeight - 20,
    stroke: palette.accent,
    strokeWidth: scaleVisual(4),
    strokeLinecap: 'square',
    opacity: 0.9,
  })

  // Closed stack thickness cue (side elevation hint as a small depth bar).
  primitives.push({
    kind: 'rect',
    id: 'telescopic-stack-thickness',
    x: panelX - 22,
    y: panelY + panelHeight * 0.3,
    width: 14,
    height: panelHeight * 0.4,
    rx: 2,
    fill: 'none',
    stroke: palette.steel,
    strokeWidth: scaleVisual(2),
    strokeDasharray: '4 3',
    opacity: 0.8,
  })
}

/**
 * Radius leaf count — intake: min 2; ~3 when opening ≈ 2500 mm / 90° turn.
 * Schematic only (does not change pricing).
 */
export function getRadiusLeafCount(clearOpeningMm: number): number {
  return clearOpeningMm >= 2500 ? 3 : 2
}

/** Radius: leaf splits for curved-path multi-leaf. Track itself stays on `track-line`. */
export function pushRadiusSlidingDetails(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  layout: SlidingLayout,
  clearOpeningMm: number,
): void {
  const { panelX, panelY, panelWidth, panelHeight } = layout
  const leafCount = getRadiusLeafCount(clearOpeningMm)
  const leafW = panelWidth / leafCount

  for (let i = 1; i < leafCount; i += 1) {
    const x = panelX + leafW * i
    primitives.push({
      kind: 'line',
      id: `radius-leaf-split-${i}`,
      x1: x,
      y1: panelY + 10,
      x2: x,
      y2: panelY + panelHeight - 10,
      stroke: palette.accent,
      strokeWidth: scaleVisual(2.4),
      strokeDasharray: '6 5',
      opacity: 0.8,
    })
  }
}

/** Bifold open-stack footprint note primitives (closed elevation already has fold lines). */
export function pushBifoldStackCue(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  args: {
    frameX: number
    frameY: number
    frameWidth: number
    frameHeight: number
    leafCount: number
  },
): void {
  // Folded pack thickness cue on hinge sides (~100 mm for 40×40).
  const packW = 18
  if (args.leafCount === 2) {
    primitives.push({
      kind: 'rect',
      id: 'bifold-stack-left',
      x: args.frameX - packW - 4,
      y: args.frameY + args.frameHeight * 0.25,
      width: packW,
      height: args.frameHeight * 0.5,
      rx: 2,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(2),
      strokeDasharray: '4 4',
      opacity: 0.75,
    })
    primitives.push({
      kind: 'rect',
      id: 'bifold-stack-right',
      x: args.frameX + args.frameWidth + 4,
      y: args.frameY + args.frameHeight * 0.25,
      width: packW,
      height: args.frameHeight * 0.5,
      rx: 2,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(2),
      strokeDasharray: '4 4',
      opacity: 0.75,
    })
  } else {
    primitives.push({
      kind: 'rect',
      id: 'bifold-stack-left',
      x: args.frameX - packW - 4,
      y: args.frameY + args.frameHeight * 0.25,
      width: packW,
      height: args.frameHeight * 0.5,
      rx: 2,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(2),
      strokeDasharray: '4 4',
      opacity: 0.75,
    })
  }
}

export function slidingTypeDetailNotes(config: GateConfig): string[] {
  switch (config.gateType) {
    case 'tracked_sliding':
      return [
        'Tracked: ~20 mm round track visible; ~10 mm gap to bottom box; runback = opening + 350 mm for rack/motor.',
        'Anti-lift guide shown as mid-height post with rollers (schematic).',
      ]
    case 'cantilever_sliding':
      return [
        'Cantilever: under-gate box ~100×50 mm; ground guide ~60×70 mm; carriages under the tail join.',
        'Foundation strip under the counterbalance shown schematically.',
      ]
    case 'telescopic_sliding': {
      const n = getTelescopicPanelCount()
      return [
        `Telescopic: ${n} panels; motor-side panel leads; closed stack thickness ~160 mm (intake).`,
      ]
    }
    case 'radius_sliding':
      return [
        `Radius: travel path always curved; ${getRadiusLeafCount(config.widthMm)} leaves shown as dashed splits (intake: 2 min, 3 near 2500 mm / 90°).`,
      ]
    default:
      return []
  }
}

/** Ground clearance cue under swing elevation (intake 50 mm). */
export function pushSwingGroundClearanceCue(
  primitives: GateRenderPrimitive[],
  palette: DetailPalette,
  args: { frameX: number; frameY: number; frameWidth: number; frameHeight: number },
): void {
  const gap = 14
  primitives.push({
    kind: 'line',
    id: 'swing-ground-clearance',
    x1: args.frameX + 40,
    y1: args.frameY + args.frameHeight + gap,
    x2: args.frameX + args.frameWidth - 40,
    y2: args.frameY + args.frameHeight + gap,
    stroke: palette.steel,
    strokeWidth: scaleVisual(3),
    strokeDasharray: '6 5',
    opacity: 0.55,
  })
}

export function swingTypeDetailNotes(config: GateConfig): string[] {
  const notes = [
    'Swing: picket centres ~100 mm; ground clearance 50 mm; frame 40×40 standard (50×50 is an upgrade).',
  ]
  if (config.gateType === 'double_swing' || config.gateType === 'bifolding_double_swing') {
    notes.push('Meeting stile shows decorative plate and latch (intake: both).')
  }
  if (config.gateType === 'bifolding_double_swing' || config.gateType === 'single_bifolding') {
    notes.push('Bifold: 2 panels per leaf, 50/50; folded pack ~100 mm (40×40) shown as side stack cues.')
  }
  if (hasOption(config, 'arched_top')) {
    notes.push('Arched top rise ~250 mm or 450 mm at centre (schematic rise in elevation).')
  }
  return notes
}

function hasOption(config: GateConfig, key: string): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

