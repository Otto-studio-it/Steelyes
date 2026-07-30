import type { GateRenderPrimitive } from './render-plan'

/**
 * CAD elevation style tokens for the configurator `technical` view.
 *
 * Visual reference:
 *   docs/frontend/foto-intake/2d-style-reference-double-swing-cad.png
 *
 * Rules:
 * - Orthographic front elevation (no perspective, no sky/grass scene).
 * - Gate + posts: black linework on white paper.
 * - Dimensions: red only (lines, arrows, mm labels).
 * - Ground: solid dark bar.
 * - Brick pillars: hatch pattern (spacing below), not photo fills.
 * - Millimetre values always come from GateConfig / client rules — never from
 *   the sample CAD numbers (3151 / 1400 / …).
 *
 * Phase 0 delivers tokens + helpers. Phase 1+ consume them to restyle the gate
 * outline, posts, and dimension layer.
 */

export const CAD_STYLE_SOURCE =
  'docs/frontend/foto-intake/2d-style-reference-double-swing-cad.png' as const

/** Colour tokens sampled from the CAD elevation reference. */
export const CAD_COLORS = {
  /** Drawing paper / SVG background */
  paper: '#FFFFFF',
  /** Gate frame, pickets, hardware outlines */
  ink: '#1A1A1A',
  /** Soft secondary ink (muted labels that are not dimensions) */
  inkMuted: '#5C5C5C',
  /** All dimension geometry and mm text */
  dim: '#C62828',
  /** Alternate dim red used in older engine accents — keep as alias */
  dimAlt: '#9E000C',
  /** Solid ground bar under the gate */
  ground: '#2A2A2A',
  /** Brick hatch / mortar lines on pillars */
  brickHatch: '#1A1A1A',
  /** Empty fills stay transparent / white */
  fillNone: 'none',
  fillPaper: '#FFFFFF',
} as const

export type CadColorToken = keyof typeof CAD_COLORS

/** Stroke widths in SVG user units (pre–visual-scale). */
export const CAD_STROKES = {
  /** Outer gate leaf frame */
  gateFrame: 2.2,
  /** Internal rails / pickets */
  gateMember: 1.4,
  /** Hardware (handle, hinges) */
  hardware: 1.6,
  /** Pillar outer rectangle */
  postOutline: 2,
  /** Brick hatch lines */
  brickHatch: 0.9,
  /** Dimension chain + extension ticks */
  dimension: 1.35,
  /** Extension line (slightly thinner than dimension) */
  extension: 1.1,
  /** Ground bar is a filled rect; outline if needed */
  groundOutline: 0,
} as const

/** Dimension annotation geometry. */
export const CAD_DIMENSION = {
  color: CAD_COLORS.dim,
  strokeWidth: CAD_STROKES.dimension,
  extensionStrokeWidth: CAD_STROKES.extension,
  /** Half-length of end ticks crossing the dimension line */
  tickHalfMmPx: 10,
  /** Arrowhead size along the dimension axis */
  arrowLengthPx: 10,
  arrowWidthPx: 6,
  /** Gap between object and start of extension line */
  extensionGapPx: 4,
  /** How far extension lines overshoot past the dimension line */
  extensionOvershootPx: 6,
  /** Offset of the width chain below the gate bottom */
  widthChainOffsetPx: 72,
  /** Offset of the height chain left of the gate */
  heightChainOffsetPx: 70,
  labelFontSizePx: 16,
  labelFontWeight: 600,
  labelFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

/** Brick pillar hatch — CAD-like mortar grid. */
export const CAD_BRICK_HATCH = {
  stroke: CAD_COLORS.brickHatch,
  strokeWidth: CAD_STROKES.brickHatch,
  opacity: 0.55,
  /** Horizontal bed-joint spacing */
  rowPx: 12,
  /** Vertical head-joint spacing */
  coursePx: 28,
  /** Stagger odd rows by this fraction of coursePx */
  staggerRatio: 0.5,
} as const

/** Solid ground bar under the elevation. */
export const CAD_GROUND = {
  fill: CAD_COLORS.ground,
  /** Thickness of the ground bar */
  heightPx: 18,
  /** Extra horizontal bleed past the gate frame */
  bleedPx: 48,
} as const

/**
 * Provisional ground clearance (style only — not a confirmed workshop rule).
 * Reference CAD shows 30 mm; pixel gap is floored so the elevation stays readable.
 */
export const CAD_PROVISIONAL_GROUND_CLEARANCE_MM = 30

/** Minimum on-screen clearance so the CAD gap reads clearly at typical frame heights. */
export const CAD_CLEARANCE_MIN_PX = 28

/** Pixel gap under the gate frame for technical elevation (label stays 30 mm). */
export function getCadClearancePx(heightMm: number, frameHeightPx: number): number {
  const scaled = Math.round(
    (CAD_PROVISIONAL_GROUND_CLEARANCE_MM / Math.max(heightMm, 1)) * Math.max(frameHeightPx, 1),
  )
  return Math.max(CAD_CLEARANCE_MIN_PX, scaled)
}

export type CadTechnicalPalette = {
  paper: string
  ink: string
  inkMuted: string
  dim: string
  ground: string
  brickHatch: string
  /** Maps onto existing ScenePalette / RenderPalette fields for technical mode */
  accent: string
  steel: string
  shadow: string
  postFill: string
  panel: string
  panelSoft: string
  label: string
  accentSoft: string
}

/** Palette for `viewMode === 'technical'` — finish colour does not paint the CAD. */
export function getCadTechnicalPalette(): CadTechnicalPalette {
  return {
    paper: CAD_COLORS.paper,
    ink: CAD_COLORS.ink,
    inkMuted: CAD_COLORS.inkMuted,
    dim: CAD_COLORS.dim,
    ground: CAD_COLORS.ground,
    brickHatch: CAD_COLORS.brickHatch,
    accent: CAD_COLORS.dim,
    steel: CAD_COLORS.inkMuted,
    shadow: 'rgba(0,0,0,0.08)',
    postFill: CAD_COLORS.fillPaper,
    panel: CAD_COLORS.fillPaper,
    panelSoft: CAD_COLORS.fillPaper,
    label: CAD_COLORS.inkMuted,
    accentSoft: CAD_COLORS.dim,
  }
}

export type CadTechnicalBackgroundOptions = {
  canvasWidth: number
  canvasHeight: number
  /** Y of the top edge of the ground bar (usually gate bottom + small gap). */
  groundTopY: number
  /** Optional left/right of the bar; defaults to full canvas with bleed. */
  gateLeftX?: number
  gateRightX?: number
}

/**
 * Paper + solid ground bar. No sky, grass, or driveway — matches the CAD sheet.
 */
export function buildCadTechnicalBackground(
  options: CadTechnicalBackgroundOptions,
): GateRenderPrimitive[] {
  const {
    canvasWidth,
    canvasHeight,
    groundTopY,
    gateLeftX = 0,
    gateRightX = canvasWidth,
  } = options

  const barLeft = Math.max(0, gateLeftX - CAD_GROUND.bleedPx)
  const barRight = Math.min(canvasWidth, gateRightX + CAD_GROUND.bleedPx)
  const barHeight = CAD_GROUND.heightPx

  return [
    {
      kind: 'rect',
      id: 'cad-paper',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      fill: CAD_COLORS.paper,
      stroke: 'none',
    },
    {
      kind: 'rect',
      id: 'cad-ground-bar',
      x: barLeft,
      y: groundTopY,
      width: Math.max(0, barRight - barLeft),
      height: barHeight,
      fill: CAD_GROUND.fill,
      stroke: 'none',
    },
  ]
}

/** True when a render plan should use CAD tokens instead of finish/installation styling. */
export function isCadTechnicalView(viewMode: string): boolean {
  return viewMode === 'technical'
}

function isDimensionPrimitiveId(id: string): boolean {
  return (
    id.startsWith('width-dimension') ||
    id.startsWith('height-dimension') ||
    id.startsWith('cad-dim-')
  )
}

function cadStrokeWidthForId(id: string, fallback: number | undefined): number {
  if (
    id === 'swing-frame' ||
    id === 'sliding-frame' ||
    id === 'sliding-panel' ||
    id.endsWith('-frame')
  ) {
    return CAD_STROKES.gateFrame
  }
  if (
    id.includes('latch') ||
    id.includes('hinge') ||
    id.includes('finial') ||
    id.includes('railhead') ||
    id.includes('handle')
  ) {
    return CAD_STROKES.hardware
  }
  if (
    id.includes('rail') ||
    id.includes('infill') ||
    id.includes('bar') ||
    id.includes('picket') ||
    id.includes('board') ||
    id.includes('track') ||
    id.includes('tail') ||
    id.includes('split') ||
    id.includes('arch')
  ) {
    return CAD_STROKES.gateMember
  }
  return fallback ?? CAD_STROKES.gateMember
}

/**
 * Phase 1 — restyle existing gate primitives into CAD elevation linework:
 * drop drop-shadows, force black strokes, white/none fills, sharper corners.
 * Dimension primitives (red) are left untouched.
 */
export function restylePrimitivesForCadTechnical(
  primitives: GateRenderPrimitive[],
): GateRenderPrimitive[] {
  return primitives
    .filter((primitive) => !primitive.id.endsWith('-shadow') && primitive.id !== 'gate-ground-shadow')
    .map((primitive) => {
      if (isDimensionPrimitiveId(primitive.id)) {
        return primitive
      }

      if (primitive.kind === 'rect') {
        const isFillPanel =
          primitive.id === 'swing-fill' ||
          primitive.id.startsWith('board-') ||
          primitive.id === 'sliding-panel-fill' ||
          primitive.id.includes('-fill')
        const isLatch = primitive.id.includes('latch')
        return {
          ...primitive,
          rx: isLatch ? 2 : 0,
          fill: isFillPanel ? CAD_COLORS.fillNone : isLatch ? CAD_COLORS.fillPaper : CAD_COLORS.fillNone,
          fillOpacity: 1,
          stroke: CAD_COLORS.ink,
          strokeWidth: cadStrokeWidthForId(primitive.id, primitive.strokeWidth),
          opacity: 1,
        }
      }

      if (primitive.kind === 'line') {
        return {
          ...primitive,
          stroke: CAD_COLORS.ink,
          strokeWidth: cadStrokeWidthForId(primitive.id, primitive.strokeWidth),
          opacity: 1,
          strokeLinecap: 'square' as const,
        }
      }

      if (primitive.kind === 'circle') {
        return {
          ...primitive,
          fill: CAD_COLORS.fillNone,
          fillOpacity: 1,
          stroke: CAD_COLORS.ink,
          strokeWidth: cadStrokeWidthForId(primitive.id, primitive.strokeWidth ?? CAD_STROKES.hardware),
          opacity: 1,
        }
      }

      if (primitive.kind === 'path') {
        return {
          ...primitive,
          fill: CAD_COLORS.fillNone,
          fillOpacity: 1,
          stroke: CAD_COLORS.ink,
          strokeWidth: cadStrokeWidthForId(primitive.id, primitive.strokeWidth),
          opacity: 1,
          strokeLinecap: 'square' as const,
          strokeLinejoin: 'miter' as const,
        }
      }

      return primitive
    })
}

export type CadPostBounds = {
  frameX: number
  frameY: number
  frameWidth: number
  frameHeight: number
}

/** Layout constants shared by posts + ground-bar bleed in technical view. */
export const CAD_POST_LAYOUT = {
  widthPx: 56,
  gapFromGatePx: 18,
  extendAboveFramePx: 36,
  extendBelowFramePx: 8,
} as const

export function getCadPostOuterBounds(bounds: CadPostBounds): { leftX: number; rightX: number } {
  const leftX = bounds.frameX - CAD_POST_LAYOUT.gapFromGatePx - CAD_POST_LAYOUT.widthPx
  const rightX =
    bounds.frameX + bounds.frameWidth + CAD_POST_LAYOUT.gapFromGatePx + CAD_POST_LAYOUT.widthPx
  return { leftX, rightX }
}

export type CadMountingPostsOptions = {
  /** Override ground extension below the frame (Phase 3 visible clearance). */
  extendBelowFramePx?: number
}

/**
 * Brick pillars matching the CAD reference: white fill, black outline, mortar hatch.
 * Drawn outside the gate frame; ground bar is separate.
 */
export function buildCadMountingPosts(
  bounds: CadPostBounds,
  options: CadMountingPostsOptions = {},
): GateRenderPrimitive[] {
  const postWidth = CAD_POST_LAYOUT.widthPx
  const gap = CAD_POST_LAYOUT.gapFromGatePx
  const extendBelow = options.extendBelowFramePx ?? CAD_POST_LAYOUT.extendBelowFramePx
  const postTop = bounds.frameY - CAD_POST_LAYOUT.extendAboveFramePx
  const postBottom = bounds.frameY + bounds.frameHeight + extendBelow
  const postHeight = postBottom - postTop
  const leftX = bounds.frameX - gap - postWidth
  const rightX = bounds.frameX + bounds.frameWidth + gap
  const primitives: GateRenderPrimitive[] = []

  for (const [side, x] of [
    ['left', leftX],
    ['right', rightX],
  ] as const) {
    primitives.push({
      kind: 'rect',
      id: `cad-${side}-pillar`,
      x,
      y: postTop,
      width: postWidth,
      height: postHeight,
      rx: 0,
      fill: CAD_COLORS.fillPaper,
      stroke: CAD_COLORS.ink,
      strokeWidth: CAD_STROKES.postOutline,
    })

    // Flat cap plate (CAD-like)
    primitives.push({
      kind: 'rect',
      id: `cad-${side}-pillar-cap`,
      x: x - 3,
      y: postTop - 10,
      width: postWidth + 6,
      height: 10,
      rx: 0,
      fill: CAD_COLORS.fillPaper,
      stroke: CAD_COLORS.ink,
      strokeWidth: CAD_STROKES.postOutline,
    })

    primitives.push(...buildCadBrickHatch(`cad-${side}-pillar`, x, postTop, postWidth, postHeight))
  }

  return primitives
}

function buildCadBrickHatch(
  idPrefix: string,
  x: number,
  y: number,
  width: number,
  height: number,
): GateRenderPrimitive[] {
  const lines: GateRenderPrimitive[] = []
  const { rowPx, coursePx, staggerRatio, stroke, strokeWidth, opacity } = CAD_BRICK_HATCH
  const inset = 3

  let row = 0
  for (let yy = y + inset; yy < y + height - inset; yy += rowPx) {
    lines.push({
      kind: 'line',
      id: `${idPrefix}-bed-${row}`,
      x1: x + inset,
      y1: yy,
      x2: x + width - inset,
      y2: yy,
      stroke,
      strokeWidth,
      opacity,
      strokeLinecap: 'square',
    })
    row += 1
  }

  let col = 0
  for (let baseX = x + inset; baseX < x + width - inset; baseX += coursePx) {
    for (let rowIndex = 0; rowIndex * rowPx < height - inset * 2; rowIndex += 1) {
      const stagger = rowIndex % 2 === 0 ? 0 : coursePx * staggerRatio
      const xx = baseX + stagger
      if (xx <= x + inset || xx >= x + width - inset) {
        continue
      }
      const y1 = y + inset + rowIndex * rowPx
      const y2 = Math.min(y + height - inset, y1 + rowPx)
      lines.push({
        kind: 'line',
        id: `${idPrefix}-head-${col}-${rowIndex}`,
        x1: xx,
        y1,
        x2: xx,
        y2,
        stroke,
        strokeWidth,
        opacity,
        strokeLinecap: 'square',
      })
    }
    col += 1
  }

  return lines
}
