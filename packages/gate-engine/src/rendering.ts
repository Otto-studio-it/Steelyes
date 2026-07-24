import { buildGateGeometryPlan } from './geometry'
import { getFinishDefinition, getFinishStrokeColor } from './finishes'
import {
  clamp,
  getLeafCount,
  getOptionQuantity,
  hasOption,
  isSlidingGate,
} from './internal/shared'
import { cantileverTailNote, getCantileverTailRatio } from './rules/cantilever'
import {
  getDecorativeBarCapacity,
  getExpectedDogBarCount,
  getExpectedDogBarRailheadCount,
  getExpectedTopRailheadCount,
} from './rules/geometry'
import { type FinishCode, type GateConfig } from './types'
import { validateGateConfig } from './validation'
import { scaleVisualBoldness } from './visual-scale'
import type { GateRenderLabel, GateRenderPlan, GateRenderPrimitive, GateRenderViewMode } from './rendering/render-plan'
import { buildPlanViewPlan } from './rendering/plan-view'
import { serializeGateRenderPlanToSvg } from './rendering/svg-serialize'
import {
  buildGateShadow,
  buildInstallationBackground,
  buildMountingPosts,
  filterInstallationLabels,
  type SceneFrameBounds,
} from './rendering/scene'

type RenderPalette = {
  ink: string
  accent: string
  accentSoft: string
  panel: string
  panelSoft: string
  steel: string
  label: string
  shadow: string
  postFill: string
}

function resolveRenderPalette(finish: FinishCode): RenderPalette {
  const definition = getFinishDefinition(finish)
  const tokens = definition.schematic

  return {
    ink: getFinishStrokeColor(tokens, finish),
    accent: tokens.accent,
    accentSoft: tokens.infill,
    panel: tokens.panel,
    panelSoft: tokens.infill,
    steel: tokens.strokeMuted,
    label: tokens.label,
    shadow: 'rgba(0, 0, 0, 0.12)',
    postFill: finish === 'black_gloss' ? tokens.infill : tokens.panel,
  }
}

export type { GateRenderLabel, GateRenderPlan, GateRenderPrimitive, GateRenderViewMode } from './rendering/render-plan'

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 860
const FRAME_X = 120
const FRAME_Y = 150
const FRAME_WIDTH = 960
const FRAME_HEIGHT = 520

function scaleVisual(value: number): number {
  return scaleVisualBoldness(value)
}

function formatTypeLabel(gateType: GateConfig['gateType']): string {
  return gateType.split('_').join(' ')
}

function formatStyleLabel(style: GateConfig['style']): string {
  return style.split('_').join(' ')
}

function pushShadowLine(
  primitives: GateRenderPrimitive[],
  primitive: Omit<Extract<GateRenderPrimitive, { kind: 'line' }>, 'id'> & { id: string },
  palette: RenderPalette,
  offsetX = 2,
  offsetY = 2,
): void {
  primitives.push({
    ...primitive,
    id: `${primitive.id}-shadow`,
    x1: primitive.x1 + offsetX,
    y1: primitive.y1 + offsetY,
    x2: primitive.x2 + offsetX,
    y2: primitive.y2 + offsetY,
    stroke: palette.shadow,
    strokeWidth: Math.max(1, (primitive.strokeWidth ?? 1) - 0.6),
    opacity: 0.45,
  })
  primitives.push(primitive)
}

function pushShadowRect(
  primitives: GateRenderPrimitive[],
  primitive: Omit<Extract<GateRenderPrimitive, { kind: 'rect' }>, 'id'> & { id: string },
  palette: RenderPalette,
  offsetX = 3,
  offsetY = 3,
): void {
  primitives.push({
    ...primitive,
    id: `${primitive.id}-shadow`,
    x: primitive.x + offsetX,
    y: primitive.y + offsetY,
    stroke: palette.shadow,
    strokeWidth: Math.max(1, (primitive.strokeWidth ?? 1) - 1),
    opacity: 0.35,
    fill: primitive.fill ?? 'none',
    fillOpacity: primitive.fillOpacity,
  })
  primitives.push(primitive)
}

function pushShadowCircle(
  primitives: GateRenderPrimitive[],
  primitive: Omit<Extract<GateRenderPrimitive, { kind: 'circle' }>, 'id'> & { id: string },
  palette: RenderPalette,
  offsetX = 2,
  offsetY = 2,
): void {
  primitives.push({
    ...primitive,
    id: `${primitive.id}-shadow`,
    cx: primitive.cx + offsetX,
    cy: primitive.cy + offsetY,
    stroke: palette.shadow,
    strokeWidth: Math.max(1, (primitive.strokeWidth ?? 1) - 0.5),
    opacity: 0.35,
    fill: primitive.fill ?? 'none',
    fillOpacity: primitive.fillOpacity,
  })
  primitives.push(primitive)
}

function railY(bounds: { topY: number; height: number }, ratio: number): number {
  return bounds.topY + bounds.height * ratio
}

function pushTubeVerticalLine(
  primitives: GateRenderPrimitive[],
  palette: RenderPalette,
  id: string,
  x: number,
  y1: number,
  y2: number,
  stroke: string,
  strokeWidth: number,
): void {
  const offset = scaleVisual(0.9)
  pushShadowLine(
    primitives,
    {
      kind: 'line',
      id: `${id}-outer`,
      x1: x - offset,
      y1: y1,
      x2: x - offset,
      y2: y2,
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
      opacity: 0.95,
    },
    palette,
    1,
    1,
  )
  pushShadowLine(
    primitives,
    {
      kind: 'line',
      id: `${id}-inner`,
      x1: x + offset,
      y1: y1,
      x2: x + offset,
      y2: y2,
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
      opacity: 0.95,
    },
    palette,
    1,
    1,
  )
}

function pushCircleScrollBand(
  primitives: GateRenderPrimitive[],
  palette: RenderPalette,
  idPrefix: string,
  leftInset: number,
  rightInset: number,
  y: number,
): void {
  const span = rightInset - leftInset
  const loopCount = clamp(Math.round(span / 42), 5, 14)
  for (let index = 0; index < loopCount; index += 1) {
    const x = leftInset + (span / (loopCount + 1)) * (index + 1)
    primitives.push({
      kind: 'path',
      id: `${idPrefix}-loop-${index}`,
      d: `M ${x - 10} ${y} C ${x - 10} ${y - 12}, ${x + 10} ${y - 12}, ${x + 10} ${y} C ${x + 10} ${y + 12}, ${x - 10} ${y + 12}, ${x - 10} ${y}`,
      fill: 'none',
      stroke: palette.accentSoft,
      strokeWidth: scaleVisual(2.2),
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      opacity: 0.82,
    })
  }
}

function pushSpearRow(
  primitives: GateRenderPrimitive[],
  palette: RenderPalette,
  leftInset: number,
  rightInset: number,
  y: number,
  count: number,
): void {
  const span = rightInset - leftInset
  for (let index = 0; index < count; index += 1) {
    const x = leftInset + (span / (count + 1)) * (index + 1)
    primitives.push({
      kind: 'path',
      id: `spear-row-${index}`,
      d: `M ${x} ${y - 10} L ${x - 5} ${y + 2} L ${x + 5} ${y + 2} Z`,
      fill: palette.accentSoft,
      stroke: palette.ink,
      strokeWidth: scaleVisual(1.2),
      opacity: 0.9,
    })
  }
}

function evaluateCubicBezier(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
): [number, number] {
  const u = 1 - t
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
  return [x, y]
}

function archYOnSwingTop(leftInset: number, rightInset: number, topY: number, x: number): number {
  const p0: [number, number] = [leftInset, topY + 30]
  const p1: [number, number] = [FRAME_X + 210, topY - 10]
  const p2: [number, number] = [FRAME_X + 990, topY - 10]
  const p3: [number, number] = [rightInset, topY + 30]

  let lo = 0
  let hi = 1
  for (let index = 0; index < 24; index += 1) {
    const mid = (lo + hi) / 2
    const [mx] = evaluateCubicBezier(mid, p0, p1, p2, p3)
    if (mx < x) lo = mid
    else hi = mid
  }

  const [, y] = evaluateCubicBezier((lo + hi) / 2, p0, p1, p2, p3)
  return y
}

function swingTopYAtX(
  arch: boolean,
  leftInset: number,
  rightInset: number,
  topY: number,
  x: number,
  flatOffset: number,
): number {
  return arch ? archYOnSwingTop(leftInset, rightInset, topY, x) : topY + flatOffset
}

function buildSwingFrame(config: GateConfig, palette: RenderPalette): GateRenderPrimitive[] {
  const topY = FRAME_Y
  const bottomY = FRAME_Y + FRAME_HEIGHT
  const centerX = FRAME_X + FRAME_WIDTH / 2
  const leafCount = getLeafCount(config.gateType)
  const arch = hasOption(config, 'arched_top')
  const leftInset = FRAME_X + scaleVisual(32)
  const rightInset = FRAME_X + FRAME_WIDTH - scaleVisual(32)
  const geometry = buildGateGeometryPlan(config)
  const frameBounds = { topY: FRAME_Y, height: FRAME_HEIGHT }
  const rails = geometry?.rails ?? {
    top: 0,
    upperMid: 0.14,
    spearBand: 0.62,
    lowerMid: 0.71,
    bottom: 0.98,
  }
  const upperMidY = railY(frameBounds, rails.upperMid)
  const spearBandY = railY(frameBounds, rails.spearBand)
  const lowerMidY = railY(frameBounds, rails.lowerMid)
  const bottomRailY = railY(frameBounds, rails.bottom)
  const lowerRailY = lowerMidY
  const useTubeProfile = geometry?.features.tubeProfile ?? false
  const upperBars = geometry?.pickets.upperCount ?? clamp(Math.round(config.widthMm / 210), 8, 16)
  const lowerBars = geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 16, 28)
  const lowerBarGap = (rightInset - leftInset) / (lowerBars + 1)
  const barGap = FRAME_WIDTH / (upperBars + 1)
  const lineColor = palette.ink
  const middleY = FRAME_Y + FRAME_HEIGHT / 2

  const primitives: GateRenderPrimitive[] = []

  pushShadowRect(primitives, {
    kind: 'rect',
    id: 'swing-frame',
    x: FRAME_X,
    y: FRAME_Y,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    rx: 8,
    fill: 'none',
    stroke: palette.ink,
    strokeWidth: scaleVisual(3.5),
  }, palette)

  primitives.push({
    kind: 'rect',
    id: 'swing-fill',
    x: FRAME_X + 8,
    y: FRAME_Y + 8,
    width: FRAME_WIDTH - 16,
    height: FRAME_HEIGHT - 16,
    rx: 8,
    fill: config.style === 'composite_boards' ? palette.panelSoft : palette.postFill,
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 1.25,
  })

  if (leafCount === 2) {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'swing-center-split',
      x1: centerX,
      y1: topY + 8,
      x2: centerX,
      y2: bottomY - 8,
      stroke: palette.ink,
      strokeWidth: scaleVisual(3),
      strokeDasharray: config.gateType === 'bifolding_double_swing' ? '6 10' : undefined,
      opacity: 0.7,
    }, palette, 1.5, 1.5)
  } else {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'swing-single-hinge',
      x1: FRAME_X + 24,
      y1: topY + 12,
      x2: FRAME_X + 24,
      y2: bottomY - 12,
      stroke: palette.ink,
      strokeWidth: scaleVisual(3),
      opacity: 0.5,
    }, palette, 1.4, 1.4)
  }

  if (arch) {
    primitives.push({
      kind: 'path',
      id: 'arched-top',
      d: `M ${leftInset} ${topY + 30} C ${FRAME_X + 210} ${topY - 10}, ${FRAME_X + 990} ${topY - 10}, ${rightInset} ${topY + 30}`,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(5),
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    })
  } else {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'top-rail',
      x1: leftInset,
      y1: topY + 26,
      x2: rightInset,
      y2: topY + 26,
      stroke: palette.accent,
      strokeWidth: scaleVisual(5),
      strokeLinecap: 'square',
      opacity: 0.95,
    }, palette, 1.2, 1.2)
  }

  pushShadowLine(primitives, {
    kind: 'line',
    id: 'upper-mid-rail',
    x1: leftInset,
    y1: upperMidY,
    x2: rightInset,
    y2: upperMidY,
    stroke: palette.accent,
    strokeWidth: scaleVisual(4.5),
    strokeLinecap: 'square',
    opacity: 0.92,
  }, palette, 1.1, 1.1)

  pushShadowLine(primitives, {
    kind: 'line',
    id: 'lower-mid-rail',
    x1: leftInset,
    y1: lowerMidY,
    x2: rightInset,
    y2: lowerMidY,
    stroke: palette.accentSoft,
    strokeWidth: scaleVisual(4.5),
    strokeLinecap: 'square',
    opacity: 0.92,
  }, palette, 1.1, 1.1)

  pushShadowLine(primitives, {
    kind: 'line',
    id: 'bottom-rail',
    x1: leftInset,
    y1: bottomRailY,
    x2: rightInset,
    y2: bottomRailY,
    stroke: palette.ink,
    strokeWidth: scaleVisual(5),
    strokeLinecap: 'square',
    opacity: 0.96,
  }, palette, 1.2, 1.2)

  if (geometry?.features.circleBands) {
    pushCircleScrollBand(primitives, palette, 'top-circle-band', leftInset, rightInset, upperMidY - 18)
    pushCircleScrollBand(primitives, palette, 'bottom-circle-band', leftInset, rightInset, lowerMidY + 18)
  }

  if (hasOption(config, 'middle_bar')) {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'middle-bar',
      x1: leftInset,
      y1: middleY,
      x2: rightInset,
      y2: middleY,
      stroke: palette.accentSoft,
      strokeWidth: scaleVisual(7),
      strokeLinecap: 'square',
      opacity: 0.98,
    }, palette, 1.4, 1.4)
  }

  if (config.style === 'traditional_victorian') {
    for (let index = 0; index < upperBars; index += 1) {
      const x = FRAME_X + barGap * (index + 1)
      const barTop = arch ? topY + 34 : upperMidY + 6
      const barBottom = spearBandY - 4
      if (useTubeProfile) {
        pushTubeVerticalLine(
          primitives,
          palette,
          `infill-bar-${index}`,
          x,
          barTop,
          barBottom,
          lineColor,
          scaleVisual(2.8),
        )
      } else {
        pushShadowLine(primitives, {
          kind: 'line',
          id: `infill-bar-${index}`,
          x1: x,
          y1: barTop,
          x2: x,
          y2: barBottom,
          stroke: lineColor,
          strokeWidth: scaleVisual(3.4),
          strokeLinecap: 'square',
          opacity: 0.95,
        }, palette, 1, 1)
      }
    }

    for (let index = 0; index < lowerBars; index += 1) {
      const x = leftInset + lowerBarGap * (index + 1)
      if (useTubeProfile) {
        pushTubeVerticalLine(
          primitives,
          palette,
          `lower-infill-bar-${index}`,
          x,
          lowerMidY + 4,
          bottomRailY - 8,
          palette.ink,
          scaleVisual(2.4),
        )
      } else {
        pushShadowLine(primitives, {
          kind: 'line',
          id: `lower-infill-bar-${index}`,
          x1: x,
          y1: lowerMidY + 4,
          x2: x,
          y2: bottomRailY - 8,
          stroke: palette.ink,
          strokeWidth: scaleVisual(2.8),
          strokeLinecap: 'square',
          opacity: 0.94,
        }, palette, 1, 1)
      }
    }

    if (geometry?.features.spearRow) {
      const spearCount = Math.min(
        getOptionQuantity(config, 'dog_bar_railheads'),
        getExpectedDogBarRailheadCount(config.widthMm),
      )
      pushSpearRow(primitives, palette, leftInset, rightInset, spearBandY, spearCount)
    }

    if (hasOption(config, 'dog_bars')) {
      const secondRowOffset = lowerBarGap / 2
      for (let index = 0; index < lowerBars - 1; index += 1) {
        const x = leftInset + secondRowOffset + lowerBarGap * (index + 1)
        pushShadowLine(primitives, {
          kind: 'line',
          id: `dog-bar-${index}`,
          x1: x,
          y1: lowerMidY + 8,
          x2: x,
          y2: bottomRailY - 10,
          stroke: palette.accentSoft,
          strokeWidth: scaleVisual(2.1),
          strokeLinecap: 'square',
          opacity: 0.92,
        }, palette, 0.8, 0.8)
      }
    }
  } else {
    const plankCount = clamp(Math.round(config.widthMm / 250), 4, 14)
    const plankWidth = FRAME_WIDTH / plankCount
    for (let index = 0; index < plankCount; index += 1) {
      const x = FRAME_X + index * plankWidth + 2
      primitives.push({
        kind: 'rect',
        id: `board-${index}`,
        x,
        y: topY + 28,
        width: plankWidth - 4,
        height: FRAME_HEIGHT - 42,
        rx: 1,
        fill: palette.panel,
        stroke: 'none',
        fillOpacity: 1,
      })
    }
  }

  if (hasOption(config, 'top_railheads')) {
    const railheadCount = Math.min(getOptionQuantity(config, 'top_railheads'), getExpectedTopRailheadCount(config.widthMm))
    const span = rightInset - leftInset
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `top-railhead-${index}`,
        cx: x,
        cy: swingTopYAtX(arch, leftInset, rightInset, topY, x, 18),
        r: scaleVisual(4.8),
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 1,
      }, palette, 1, 1)
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    const railheadCount = Math.min(
      getOptionQuantity(config, 'dog_bar_railheads'),
      getExpectedDogBarRailheadCount(config.widthMm),
    )
    const span = rightInset - leftInset
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `dog-railhead-${index}`,
        cx: x,
        cy: lowerRailY - 4,
        r: scaleVisual(4.3),
        fill: palette.accentSoft,
        stroke: palette.ink,
        strokeWidth: 1,
      }, palette, 1, 1)
    }
  }

  if (hasOption(config, 'bushes')) {
    const bushCount = Math.min(getOptionQuantity(config, 'bushes'), getDecorativeBarCapacity(config))
    const span = rightInset - leftInset
    for (let index = 0; index < bushCount; index += 1) {
      const ratio = (index + 0.5) / bushCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `bush-${index}`,
        cx: x,
        cy: middleY - 28,
        r: scaleVisual(8),
        fill: palette.accentSoft,
        fillOpacity: 0.18,
        stroke: palette.accentSoft,
        strokeWidth: scaleVisual(2),
      }, palette, 1.2, 1.2)
    }
  }

  if (hasOption(config, 'spirals')) {
    const spiralCount = Math.min(getOptionQuantity(config, 'spirals'), getDecorativeBarCapacity(config))
    const span = rightInset - leftInset
    for (let index = 0; index < spiralCount; index += 1) {
      const ratio = (index + 0.5) / spiralCount
      const x = leftInset + span * ratio
      primitives.push({
        kind: 'path',
        id: `spiral-${index}`,
        d: `M ${x - 8} ${middleY + 24} C ${x - 8} ${middleY + 5}, ${x + 10} ${middleY + 5}, ${x + 10} ${middleY + 24} C ${x + 10} ${middleY + 43}, ${x - 6} ${middleY + 43}, ${x - 6} ${middleY + 24}`,
        fill: 'none',
        stroke: palette.accent,
        strokeWidth: scaleVisual(2.5),
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        opacity: 0.75,
      })
    }
  }

  pushShadowRect(primitives, {
    kind: 'rect',
    id: 'center-latch-plate',
    x: centerX - 12,
    y: middleY - 58,
    width: 24,
    height: 116,
    rx: 6,
    fill: '#F7F7F7',
    stroke: palette.ink,
    strokeWidth: scaleVisual(2.4),
  }, palette)

  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'center-latch-hole',
    cx: centerX,
    cy: middleY,
    r: 3.2,
    fill: palette.ink,
    stroke: 'none',
  }, palette, 0.8, 0.8)

  pushShadowLine(primitives, {
    kind: 'line',
    id: 'left-hinge-axis',
    x1: FRAME_X + 4,
    y1: FRAME_Y + 118,
    x2: FRAME_X + 4,
    y2: FRAME_Y + 176,
    stroke: palette.ink,
    strokeWidth: scaleVisual(3.4),
    strokeLinecap: 'square',
  }, palette, 0.8, 0.8)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'right-hinge-axis',
    x1: FRAME_X + FRAME_WIDTH - 4,
    y1: FRAME_Y + 118,
    x2: FRAME_X + FRAME_WIDTH - 4,
    y2: FRAME_Y + 176,
    stroke: palette.ink,
    strokeWidth: scaleVisual(3.4),
    strokeLinecap: 'square',
  }, palette, 0.8, 0.8)

  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'left-top-finial',
    cx: FRAME_X + 10,
    cy: swingTopYAtX(arch, leftInset, rightInset, topY, FRAME_X + 10, 12),
    r: scaleVisual(5.2),
    fill: '#FAFAFA',
    stroke: palette.ink,
    strokeWidth: scaleVisual(2.2),
  }, palette, 0.8, 0.8)
  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'right-top-finial',
    cx: FRAME_X + FRAME_WIDTH - 10,
    cy: swingTopYAtX(arch, leftInset, rightInset, topY, FRAME_X + FRAME_WIDTH - 10, 12),
    r: scaleVisual(5.2),
    fill: '#FAFAFA',
    stroke: palette.ink,
    strokeWidth: scaleVisual(2.2),
  }, palette, 0.8, 0.8)

  return primitives
}

function buildSlidingFrame(config: GateConfig, palette: RenderPalette): GateRenderPrimitive[] {
  const trackY = FRAME_Y + FRAME_HEIGHT - 38
  const baseY = FRAME_Y + 36
  const panelHeight = FRAME_HEIGHT - 64
  const isCantilever = config.gateType === 'cantilever_sliding'
  const tailRatio = getCantileverTailRatio(config.widthMm)
  const tailWidth = isCantilever ? FRAME_WIDTH * tailRatio : 0
  const panelWidth = isCantilever
    ? FRAME_WIDTH - tailWidth - 100
    : FRAME_WIDTH * (config.gateType === 'telescopic_sliding' ? 0.78 : 0.92)
  const panelX = isCantilever ? FRAME_X + 28 + tailWidth - 12 : FRAME_X + FRAME_WIDTH - panelWidth - 32
  const panelY = baseY
  const isRadius = config.gateType === 'radius_sliding'
  const isTelescopic = config.gateType === 'telescopic_sliding'
  const boardCount = clamp(Math.round(config.widthMm / 320), 5, 11)
  const boardWidth = panelWidth / boardCount
  const primitives: GateRenderPrimitive[] = []

  primitives.push({
    kind: 'rect',
    id: 'sliding-frame',
    x: FRAME_X,
    y: FRAME_Y,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    rx: 18,
    fill: 'none',
    stroke: palette.ink,
    strokeWidth: scaleVisual(6),
  })

  primitives.push({
    kind: 'line',
    id: 'track-line',
    x1: FRAME_X + 30,
    y1: trackY,
    x2: FRAME_X + FRAME_WIDTH - 30,
    y2: trackY,
    stroke: palette.steel,
    strokeWidth: scaleVisual(7),
    strokeLinecap: 'round',
    opacity: 0.9,
  })

  if (isCantilever) {
    primitives.push({
      kind: 'rect',
      id: 'cantilever-tail',
      x: FRAME_X + 28,
      y: panelY + 8,
      width: tailWidth,
      height: panelHeight - 16,
      rx: 10,
      fill: palette.postFill,
      stroke: palette.ink,
      strokeWidth: scaleVisual(3.4),
      fillOpacity: 0.98,
    })

    primitives.push({
      kind: 'line',
      id: 'cantilever-tail-join',
      x1: FRAME_X + 28 + tailWidth,
      y1: panelY + 12,
      x2: FRAME_X + 28 + tailWidth,
      y2: panelY + panelHeight - 12,
      stroke: palette.accent,
      strokeWidth: scaleVisual(4),
      strokeDasharray: '9 9',
      opacity: 0.65,
    })
  }

  primitives.push({
    kind: 'rect',
    id: 'sliding-panel',
    x: isCantilever ? FRAME_X + 28 + tailWidth - 12 : panelX,
    y: panelY,
    width: isCantilever ? panelWidth + 12 : panelWidth,
    height: panelHeight,
    rx: isRadius ? 80 : 14,
    fill: config.style === 'composite_boards' ? palette.panelSoft : palette.postFill,
    stroke: palette.ink,
    strokeWidth: scaleVisual(4),
    fillOpacity: 0.95,
  })

  if (isRadius) {
    primitives.push({
      kind: 'path',
      id: 'radius-top',
      d: `M ${panelX + 16} ${panelY + 44} C ${panelX + panelWidth * 0.35} ${panelY - 20}, ${panelX + panelWidth * 0.68} ${panelY - 20}, ${panelX + panelWidth - 16} ${panelY + 44}`,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(5),
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    })
  }

  if (isTelescopic) {
    const segmentCount = 3
    const segmentWidth = panelWidth / segmentCount
    for (let index = 0; index < segmentCount; index += 1) {
      primitives.push({
        kind: 'rect',
        id: `telescopic-segment-${index}`,
        x: panelX + index * segmentWidth,
        y: panelY + 2 + index * 3,
        width: segmentWidth - index * 6,
        height: panelHeight - 4 - index * 6,
        rx: 12,
        fill: 'none',
        stroke: palette.accent,
        strokeWidth: scaleVisual(3),
        strokeDasharray: index === 0 ? undefined : '8 8',
        opacity: 0.7,
      })
    }
  }

  const barCount = config.style === 'traditional_victorian' ? clamp(Math.round(config.widthMm / 230), 6, 14) : boardCount
  for (let index = 0; index < barCount; index += 1) {
    const x = panelX + boardWidth * (index + 0.5)
    if (config.style === 'traditional_victorian') {
      primitives.push({
        kind: 'line',
        id: `sliding-bar-${index}`,
        x1: x,
        y1: panelY + 26,
        x2: x,
        y2: panelY + panelHeight - 16,
        stroke: palette.ink,
        strokeWidth: scaleVisual(4),
        opacity: 0.85,
      })
    } else {
      primitives.push({
        kind: 'rect',
        id: `sliding-board-${index}`,
        x: panelX + index * boardWidth + 1,
        y: panelY + 8,
        width: boardWidth - 2,
        height: panelHeight - 16,
        rx: 2,
        fill: palette.panel,
        stroke: 'none',
        fillOpacity: 0.95,
      })
    }
  }

  if (hasOption(config, 'middle_bar')) {
    primitives.push({
      kind: 'line',
      id: 'sliding-middle-bar',
      x1: panelX + 16,
      y1: panelY + panelHeight / 2,
      x2: panelX + panelWidth - 16,
      y2: panelY + panelHeight / 2,
      stroke: palette.accentSoft,
      strokeWidth: scaleVisual(5),
    })
  }

  if (hasOption(config, 'arched_top')) {
    primitives.push({
      kind: 'path',
      id: 'sliding-arch',
      d: `M ${panelX + 20} ${panelY + 38} C ${panelX + panelWidth * 0.3} ${panelY - 22}, ${panelX + panelWidth * 0.7} ${panelY - 22}, ${panelX + panelWidth - 20} ${panelY + 38}`,
      fill: 'none',
      stroke: palette.accent,
      strokeWidth: scaleVisual(5),
    })
  }

  if (hasOption(config, 'top_railheads')) {
    const railheadCount = Math.min(
      getOptionQuantity(config, 'top_railheads'),
      getExpectedTopRailheadCount(config.widthMm),
    )
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      primitives.push({
        kind: 'circle',
        id: `sliding-top-railhead-${index}`,
        cx: panelX + panelWidth * ratio,
        cy: panelY + 20,
        r: scaleVisual(4),
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 1,
      })
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    const railheadCount = Math.min(
      getOptionQuantity(config, 'dog_bar_railheads'),
      getExpectedDogBarRailheadCount(config.widthMm),
    )
    const y = panelY + panelHeight * 0.76
    const span = panelWidth - 40
    primitives.push({
      kind: 'line',
      id: 'sliding-dog-bar',
      x1: panelX + 18,
      y1: y,
      x2: panelX + panelWidth - 18,
      y2: y,
      stroke: palette.accentSoft,
      strokeWidth: scaleVisual(4),
    })
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      primitives.push({
        kind: 'circle',
        id: `sliding-dog-railhead-${index}`,
        cx: panelX + 20 + span * ratio,
        cy: y,
        r: scaleVisual(4),
        fill: palette.accentSoft,
        stroke: palette.ink,
        strokeWidth: 1,
      })
    }
  }

  if (hasOption(config, 'dog_bars')) {
    const dogBarCount = Math.min(getOptionQuantity(config, 'dog_bars'), getExpectedDogBarCount(config.widthMm))
    const span = panelWidth - 40
    for (let index = 0; index < dogBarCount; index += 1) {
      const ratio = (index + 1) / (dogBarCount + 1)
      primitives.push({
        kind: 'line',
        id: `sliding-dog-bar-${index}`,
        x1: panelX + 20 + span * ratio,
        y1: panelY + panelHeight * 0.78,
        x2: panelX + 20 + span * ratio,
        y2: panelY + panelHeight - 20,
        stroke: palette.ink,
        strokeWidth: scaleVisual(4),
      })
    }
  }

  if (hasOption(config, 'bushes')) {
    const bushCount = Math.min(getOptionQuantity(config, 'bushes'), getDecorativeBarCapacity(config))
    const span = panelWidth - 80
    for (let index = 0; index < bushCount; index += 1) {
      const ratio = (index + 0.5) / bushCount
      primitives.push({
        kind: 'circle',
        id: `sliding-bush-${index}`,
        cx: panelX + 40 + span * ratio,
        cy: panelY + panelHeight * 0.42,
        r: scaleVisual(8),
        fill: palette.accentSoft,
        fillOpacity: 0.18,
        stroke: palette.accentSoft,
        strokeWidth: scaleVisual(2),
      })
    }
  }

  if (hasOption(config, 'spirals')) {
    const spiralCount = Math.min(getOptionQuantity(config, 'spirals'), getDecorativeBarCapacity(config))
    const span = panelWidth - 80
    for (let index = 0; index < spiralCount; index += 1) {
      const cx = panelX + 40 + span * ((index + 0.5) / spiralCount)
      primitives.push({
        kind: 'path',
        id: `sliding-spiral-${index}`,
        d: `M ${cx - 8} ${panelY + panelHeight * 0.42 + 24} C ${cx - 8} ${panelY + panelHeight * 0.42 + 2}, ${cx + 10} ${panelY + panelHeight * 0.42 + 2}, ${cx + 10} ${panelY + panelHeight * 0.42 + 24} C ${cx + 10} ${panelY + panelHeight * 0.42 + 46}, ${cx - 6} ${panelY + panelHeight * 0.42 + 46}, ${cx - 6} ${panelY + panelHeight * 0.42 + 24}`,
        fill: 'none',
        stroke: palette.accent,
        strokeWidth: scaleVisual(2.4),
      })
    }
  }

  return primitives
}

export function buildGateRenderPlan(
  config: GateConfig,
  options: { viewMode?: GateRenderViewMode } = {},
): GateRenderPlan {
  const viewMode = options.viewMode ?? 'installation'
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    throw new Error('Invalid gate config for rendering')
  }

  const palette = resolveRenderPalette(config.finish)
  const subtitle = `${config.widthMm} mm opening · ${config.heightMm} mm high · ${formatStyleLabel(config.style)}`

  if (viewMode === 'plan') {
    const planTitle = `${formatTypeLabel(config.gateType)} — plan view`
    const planParts = buildPlanViewPlan({
      gateType: config.gateType,
      style: config.style,
      widthMm: config.widthMm,
      heightMm: config.heightMm,
      title: planTitle,
      subtitle,
    })

    return {
      width: 1200,
      height: 860,
      viewBox: '0 0 1200 860',
      viewMode: 'plan',
      title: planTitle,
      subtitle,
      notes: planParts.notes ?? [],
      background: planParts.background ?? [],
      primitives: planParts.primitives ?? [],
      labels: [
        {
          id: 'plan-title',
          x: 48,
          y: 48,
          text: planTitle,
          anchor: 'start',
          size: 24,
          fill: palette.ink,
          weight: 700,
        },
        {
          id: 'plan-subtitle',
          x: 48,
          y: 76,
          text: subtitle,
          anchor: 'start',
          size: 14,
          fill: palette.steel,
          weight: 500,
        },
        ...(planParts.labels ?? []),
      ],
    }
  }

  const isSliding = isSlidingGate(config.gateType)
  const title =
    viewMode === 'installation'
      ? `${formatTypeLabel(config.gateType)} — installation view`
      : `${formatTypeLabel(config.gateType)} preview`
  const notes: string[] =
    viewMode === 'installation'
      ? ['Installation preview with mounting posts and ground context']
      : ['2D technical drawing preview']

  if (hasOption(config, 'top_railheads') || hasOption(config, 'dog_bar_railheads')) {
    notes.push('Railheads are shown schematically until the final catalogue is confirmed.')
  }

  if (
    hasOption(config, 'top_railheads') ||
    hasOption(config, 'dog_bar_railheads') ||
    hasOption(config, 'dog_bars') ||
    hasOption(config, 'bushes') ||
    hasOption(config, 'spirals')
  ) {
    notes.push('Decorative options are shown schematically at the selected quantity.')
  }

  if (config.style === 'composite_boards') {
    notes.push('Panel fill is schematic and intentionally clean.')
  }

  if (config.gateType === 'cantilever_sliding') {
    notes.push(cantileverTailNote(config.widthMm))
  }

  const geometryPlan = buildGateGeometryPlan(config)
  if (geometryPlan) {
    notes.push('Victorian swing layout uses gate-audit zone ratios and four horizontal rails.')
    for (const note of geometryPlan.notes) {
      notes.push(note)
    }
  }

  const frameBounds: SceneFrameBounds = {
    frameX: FRAME_X,
    frameY: FRAME_Y,
    frameWidth: FRAME_WIDTH,
    frameHeight: FRAME_HEIGHT,
  }

  const gatePrimitives = isSliding ? buildSlidingFrame(config, palette) : buildSwingFrame(config, palette)
  const background =
    viewMode === 'installation' ? buildInstallationBackground(CANVAS_WIDTH, CANVAS_HEIGHT) : []
  const sceneElements: GateRenderPrimitive[] = []

  if (viewMode === 'installation') {
    sceneElements.push(buildGateShadow(frameBounds))
    sceneElements.push(...buildMountingPosts(config, frameBounds, palette))
  }

  const primitives = [...sceneElements, ...gatePrimitives]

  if (viewMode === 'technical') {
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-line',
    x1: FRAME_X - 4,
    y1: FRAME_Y + FRAME_HEIGHT + 72,
    x2: FRAME_X + FRAME_WIDTH + 4,
    y2: FRAME_Y + FRAME_HEIGHT + 72,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-line-shadow',
    x1: FRAME_X - 4,
    y1: FRAME_Y + FRAME_HEIGHT + 74,
    x2: FRAME_X + FRAME_WIDTH + 4,
    y2: FRAME_Y + FRAME_HEIGHT + 74,
    stroke: palette.shadow,
    strokeWidth: scaleVisual(1),
    opacity: 0.5,
  }, palette, 0, 0)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-start',
    x1: FRAME_X,
    y1: FRAME_Y + FRAME_HEIGHT + 58,
    x2: FRAME_X,
    y2: FRAME_Y + FRAME_HEIGHT + 86,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-end',
    x1: FRAME_X + FRAME_WIDTH,
    y1: FRAME_Y + FRAME_HEIGHT + 58,
    x2: FRAME_X + FRAME_WIDTH,
    y2: FRAME_Y + FRAME_HEIGHT + 86,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-line',
    x1: FRAME_X - 70,
    y1: FRAME_Y - 2,
    x2: FRAME_X - 70,
    y2: FRAME_Y + FRAME_HEIGHT + 2,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-line-shadow',
    x1: FRAME_X - 68,
    y1: FRAME_Y - 2,
    x2: FRAME_X - 68,
    y2: FRAME_Y + FRAME_HEIGHT + 2,
    stroke: palette.shadow,
    strokeWidth: scaleVisual(1),
    opacity: 0.5,
  }, palette, 0, 0)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-start',
    x1: FRAME_X - 86,
    y1: FRAME_Y,
    x2: FRAME_X - 54,
    y2: FRAME_Y,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-end',
    x1: FRAME_X - 86,
    y1: FRAME_Y + FRAME_HEIGHT,
    x2: FRAME_X - 54,
    y2: FRAME_Y + FRAME_HEIGHT,
    stroke: palette.steel,
    strokeWidth: scaleVisual(1.8),
    strokeLinecap: 'square',
  }, palette, 1, 1)
  }

  const labels: GateRenderLabel[] = [
    {
      id: 'label-title',
      x: FRAME_X,
      y: FRAME_Y - 46,
      text: title,
      anchor: 'start',
      size: 28,
      fill: palette.ink,
      weight: 700,
    },
    {
      id: 'label-subtitle',
      x: FRAME_X,
      y: FRAME_Y - 18,
      text: subtitle,
      anchor: 'start',
      size: 14,
      fill: palette.steel,
      weight: 500,
    },
    {
      id: 'label-dimensions',
      x: FRAME_X + FRAME_WIDTH - 12,
      y: FRAME_Y + FRAME_HEIGHT + 54,
      text: `${config.widthMm} mm`,
      anchor: 'end',
      size: 18,
      fill: palette.accent,
      weight: 700,
    },
    {
      id: 'label-height',
      x: FRAME_X - 78,
      y: FRAME_Y + FRAME_HEIGHT / 2,
      text: `${config.heightMm} mm`,
      anchor: 'end',
      size: 18,
      fill: palette.accent,
      weight: 700,
    },
  ]

  if (viewMode === 'installation' && config.posts.enabled && config.posts.material !== 'none') {
    labels.push({
      id: 'label-posts',
      x: FRAME_X,
      y: FRAME_Y + FRAME_HEIGHT + 36,
      text: `Posts: ${config.posts.material.replace('_', ' ')} · ${config.posts.capStyle} cap`,
      anchor: 'start',
      size: 12,
      fill: palette.steel,
      weight: 500,
    })
  }

  if (isSliding) {
    labels.push({
      id: 'label-track',
      x: FRAME_X + 22,
      y: FRAME_Y + FRAME_HEIGHT + 32,
      text: config.gateType === 'cantilever_sliding' ? 'Track / counterbalance schematic' : 'Track / rail schematic',
      anchor: 'start',
      size: 13,
      fill: palette.steel,
      weight: 500,
    })
    if (config.gateType === 'cantilever_sliding') {
      labels.push({
        id: 'label-tail',
        x: FRAME_X + 28 + (FRAME_WIDTH * getCantileverTailRatio(config.widthMm)) / 2,
        y: FRAME_Y + 84,
        text:
          config.widthMm === 4000 ? 'Counterbalance tail = 1/3 at 4m' : 'Counterbalance tail visible',
        anchor: 'middle',
        size: 12,
        fill: palette.accent,
        weight: 600,
      })
    }
  }

  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    viewBox: `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`,
    viewMode,
    title,
    subtitle,
    notes,
    background,
    primitives,
    labels: viewMode === 'technical' ? labels : filterInstallationLabels(labels),
  }
}

export { serializeGateRenderPlanToSvg } from './rendering/svg-serialize'
