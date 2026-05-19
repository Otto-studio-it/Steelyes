import { type GateConfig, type GateOptionSelection } from './types'

export type GateRenderPrimitive =
  | {
      kind: 'rect'
      id: string
      x: number
      y: number
      width: number
      height: number
      rx?: number
      fill?: string
      fillOpacity?: number
      stroke?: string
      strokeWidth?: number
      strokeDasharray?: string
      opacity?: number
    }
  | {
      kind: 'line'
      id: string
      x1: number
      y1: number
      x2: number
      y2: number
      stroke?: string
      strokeWidth?: number
      strokeDasharray?: string
      strokeLinecap?: 'round' | 'square' | 'butt'
      opacity?: number
    }
  | {
      kind: 'circle'
      id: string
      cx: number
      cy: number
      r: number
      fill?: string
      fillOpacity?: number
      stroke?: string
      strokeWidth?: number
      opacity?: number
    }
  | {
      kind: 'path'
      id: string
      d: string
      fill?: string
      fillOpacity?: number
      stroke?: string
      strokeWidth?: number
      strokeLinecap?: 'round' | 'square' | 'butt'
      strokeLinejoin?: 'round' | 'bevel' | 'miter'
      opacity?: number
    }

export type GateRenderLabel = {
  id: string
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
  size?: number
  fill?: string
  opacity?: number
  weight?: number
}

export type GateRenderPlan = {
  width: number
  height: number
  viewBox: string
  title: string
  subtitle: string
  notes: string[]
  primitives: GateRenderPrimitive[]
  labels: GateRenderLabel[]
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 860
const FRAME_X = 120
const FRAME_Y = 150
const FRAME_WIDTH = 960
const FRAME_HEIGHT = 520

const COLOR_INK = '#202020'
const COLOR_RED = '#2A2A2A'
const COLOR_PANEL = '#FFFFFF'
const COLOR_PANEL_SOFT = '#F7F7F7'
const COLOR_GOLD = '#5F5F5F'
const COLOR_STEEL = '#8A8A8A'
const COLOR_SHADOW = 'rgba(0, 0, 0, 0.12)'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getLeafCount(gateType: GateConfig['gateType']): number {
  if (gateType === 'double_swing' || gateType === 'bifolding_double_swing') {
    return 2
  }

  return 1
}

function isSlidingGate(gateType: GateConfig['gateType']): boolean {
  return gateType.includes('sliding')
}

function formatTypeLabel(gateType: GateConfig['gateType']): string {
  return gateType.split('_').join(' ')
}

function hasOption(config: GateConfig, key: GateOptionSelection['key']): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function getOptionQuantity(config: GateConfig, key: GateOptionSelection['key']): number {
  const option = config.options.find((item) => item.key === key && item.enabled)
  return option?.quantity && option.quantity > 0 ? option.quantity : 1
}

function pushShadowLine(
  primitives: GateRenderPrimitive[],
  primitive: Omit<Extract<GateRenderPrimitive, { kind: 'line' }>, 'id'> & { id: string },
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
    stroke: COLOR_SHADOW,
    strokeWidth: Math.max(1, (primitive.strokeWidth ?? 1) - 0.6),
    opacity: 0.45,
  })
  primitives.push(primitive)
}

function pushShadowRect(
  primitives: GateRenderPrimitive[],
  primitive: Omit<Extract<GateRenderPrimitive, { kind: 'rect' }>, 'id'> & { id: string },
  offsetX = 3,
  offsetY = 3,
): void {
  primitives.push({
    ...primitive,
    id: `${primitive.id}-shadow`,
    x: primitive.x + offsetX,
    y: primitive.y + offsetY,
    stroke: COLOR_SHADOW,
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
  offsetX = 2,
  offsetY = 2,
): void {
  primitives.push({
    ...primitive,
    id: `${primitive.id}-shadow`,
    cx: primitive.cx + offsetX,
    cy: primitive.cy + offsetY,
    stroke: COLOR_SHADOW,
    strokeWidth: Math.max(1, (primitive.strokeWidth ?? 1) - 0.5),
    opacity: 0.35,
    fill: primitive.fill ?? 'none',
    fillOpacity: primitive.fillOpacity,
  })
  primitives.push(primitive)
}

function buildSwingFrame(config: GateConfig): GateRenderPrimitive[] {
  const topY = FRAME_Y
  const bottomY = FRAME_Y + FRAME_HEIGHT
  const centerX = FRAME_X + FRAME_WIDTH / 2
  const leafCount = getLeafCount(config.gateType)
  const arch = hasOption(config, 'arched_top')
  const postWidth = 42
  const leftPostX = FRAME_X - 24
  const rightPostX = FRAME_X + FRAME_WIDTH - postWidth + 24
  const leftInset = FRAME_X + 32
  const rightInset = FRAME_X + FRAME_WIDTH - 32
  const middleY = FRAME_Y + FRAME_HEIGHT / 2
  const lowerRailY = FRAME_Y + FRAME_HEIGHT * 0.78
  const upperBars = clamp(Math.round(config.widthMm / 210), 8, 16)
  const barGap = FRAME_WIDTH / (upperBars + 1)
  const lowerBars = clamp(Math.round(config.widthMm / 90), 16, 28)
  const lowerBarGap = (rightInset - leftInset) / (lowerBars + 1)
  const lineColor = COLOR_INK

  const primitives: GateRenderPrimitive[] = []

  pushShadowRect(primitives, {
    kind: 'rect',
    id: 'left-post',
    x: leftPostX,
    y: FRAME_Y - 8,
    width: postWidth,
    height: FRAME_HEIGHT + 16,
    rx: 2,
    fill: '#FCFCFC',
    stroke: COLOR_INK,
    strokeWidth: 4.4,
  })

  pushShadowRect(primitives, {
    kind: 'rect',
    id: 'right-post',
    x: rightPostX,
    y: FRAME_Y - 8,
    width: postWidth,
    height: FRAME_HEIGHT + 16,
    rx: 2,
    fill: '#FCFCFC',
    stroke: COLOR_INK,
    strokeWidth: 4.4,
  })

  pushShadowRect(primitives, {
    kind: 'rect',
    id: 'swing-frame',
    x: FRAME_X,
    y: FRAME_Y,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    rx: 8,
    fill: 'none',
    stroke: COLOR_INK,
    strokeWidth: 3.5,
  })

  primitives.push({
    kind: 'rect',
    id: 'swing-fill',
    x: FRAME_X + 8,
    y: FRAME_Y + 8,
    width: FRAME_WIDTH - 16,
    height: FRAME_HEIGHT - 16,
    rx: 8,
    fill: config.style === 'composite_boards' ? COLOR_PANEL_SOFT : '#FEFEFE',
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 1,
  })

  if (leafCount === 2) {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'swing-center-split',
      x1: centerX,
      y1: topY + 8,
      x2: centerX,
      y2: bottomY - 8,
      stroke: COLOR_INK,
      strokeWidth: 3,
      strokeDasharray: config.gateType === 'bifolding_double_swing' ? '6 10' : undefined,
      opacity: 0.7,
    }, 1.5, 1.5)
  } else {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'swing-single-hinge',
      x1: FRAME_X + 24,
      y1: topY + 12,
      x2: FRAME_X + 24,
      y2: bottomY - 12,
      stroke: COLOR_INK,
      strokeWidth: 3,
      opacity: 0.5,
    }, 1.4, 1.4)
  }

  if (arch) {
    primitives.push({
      kind: 'path',
      id: 'arched-top',
      d: `M ${leftInset} ${topY + 30} C ${FRAME_X + 210} ${topY - 10}, ${FRAME_X + 990} ${topY - 10}, ${rightInset} ${topY + 30}`,
      fill: 'none',
      stroke: COLOR_RED,
      strokeWidth: 5,
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
      stroke: COLOR_RED,
      strokeWidth: 5,
      strokeLinecap: 'square',
      opacity: 0.95,
    }, 1.2, 1.2)
  }

  if (hasOption(config, 'middle_bar')) {
    pushShadowLine(primitives, {
      kind: 'line',
      id: 'middle-bar',
      x1: leftInset,
      y1: middleY,
      x2: rightInset,
      y2: middleY,
      stroke: COLOR_GOLD,
      strokeWidth: 7,
      strokeLinecap: 'square',
      opacity: 0.98,
    }, 1.4, 1.4)
  }

  if (config.style === 'traditional_victorian') {
    for (let index = 0; index < upperBars; index += 1) {
      const x = FRAME_X + barGap * (index + 1)
      pushShadowLine(primitives, {
        kind: 'line',
        id: `infill-bar-${index}`,
        x1: x,
        y1: topY + 32,
        x2: x,
        y2: lowerRailY,
        stroke: lineColor,
        strokeWidth: 3.4,
        strokeLinecap: 'square',
        opacity: 0.95,
      }, 1, 1)
    }

    for (let index = 0; index < lowerBars; index += 1) {
      const x = leftInset + lowerBarGap * (index + 1)
      pushShadowLine(primitives, {
        kind: 'line',
        id: `lower-infill-bar-${index}`,
        x1: x,
        y1: lowerRailY,
        x2: x,
        y2: bottomY - 18,
        stroke: COLOR_INK,
        strokeWidth: 2.8,
        strokeLinecap: 'square',
        opacity: 0.94,
      }, 1, 1)
    }

    if (hasOption(config, 'dog_bars')) {
      const secondRowOffset = lowerBarGap / 2
      for (let index = 0; index < lowerBars - 1; index += 1) {
        const x = leftInset + secondRowOffset + lowerBarGap * (index + 1)
        pushShadowLine(primitives, {
          kind: 'line',
          id: `dog-bar-${index}`,
          x1: x,
          y1: lowerRailY + 8,
          x2: x,
          y2: bottomY - 14,
          stroke: COLOR_GOLD,
          strokeWidth: 2.1,
          strokeLinecap: 'square',
          opacity: 0.92,
        }, 0.8, 0.8)
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
        fill: COLOR_PANEL,
        stroke: 'none',
        fillOpacity: 1,
      })
    }
  }

  if (hasOption(config, 'top_railheads')) {
    const railheadCount = clamp(Math.round(config.widthMm / 190), 6, 14)
    const span = rightInset - leftInset
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `top-railhead-${index}`,
        cx: x,
        cy: topY + 18,
        r: 4.8,
        fill: COLOR_RED,
        stroke: COLOR_INK,
        strokeWidth: 1,
      }, 1, 1)
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    const railheadCount = clamp(Math.round(config.widthMm / 220), 4, 10)
    const span = rightInset - leftInset
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `dog-railhead-${index}`,
        cx: x,
        cy: lowerRailY - 4,
        r: 4.3,
        fill: COLOR_GOLD,
        stroke: COLOR_INK,
        strokeWidth: 1,
      }, 1, 1)
    }
  }

  if (hasOption(config, 'bushes')) {
    const bushCount = getOptionQuantity(config, 'bushes')
    const span = rightInset - leftInset
    for (let index = 0; index < bushCount; index += 1) {
      const ratio = (index + 0.5) / bushCount
      const x = leftInset + span * ratio
      pushShadowCircle(primitives, {
        kind: 'circle',
        id: `bush-${index}`,
        cx: x,
        cy: middleY - 28,
        r: 8,
        fill: COLOR_GOLD,
        fillOpacity: 0.18,
        stroke: COLOR_GOLD,
        strokeWidth: 2,
      }, 1.2, 1.2)
    }
  }

  if (hasOption(config, 'spirals')) {
    const spiralCount = getOptionQuantity(config, 'spirals')
    const span = rightInset - leftInset
    for (let index = 0; index < spiralCount; index += 1) {
      const ratio = (index + 0.5) / spiralCount
      const x = leftInset + span * ratio
      primitives.push({
        kind: 'path',
        id: `spiral-${index}`,
        d: `M ${x - 8} ${middleY + 24} C ${x - 8} ${middleY + 5}, ${x + 10} ${middleY + 5}, ${x + 10} ${middleY + 24} C ${x + 10} ${middleY + 43}, ${x - 6} ${middleY + 43}, ${x - 6} ${middleY + 24}`,
        fill: 'none',
        stroke: COLOR_RED,
        strokeWidth: 2.5,
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
    stroke: COLOR_INK,
    strokeWidth: 2.4,
  })

  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'center-latch-hole',
    cx: centerX,
    cy: middleY,
    r: 3.2,
    fill: COLOR_INK,
    stroke: 'none',
  }, 0.8, 0.8)

  pushShadowLine(primitives, {
    kind: 'line',
    id: 'left-hinge-axis',
    x1: FRAME_X + 4,
    y1: FRAME_Y + 118,
    x2: FRAME_X + 4,
    y2: FRAME_Y + 176,
    stroke: COLOR_INK,
    strokeWidth: 3.4,
    strokeLinecap: 'square',
  }, 0.8, 0.8)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'right-hinge-axis',
    x1: FRAME_X + FRAME_WIDTH - 4,
    y1: FRAME_Y + 118,
    x2: FRAME_X + FRAME_WIDTH - 4,
    y2: FRAME_Y + 176,
    stroke: COLOR_INK,
    strokeWidth: 3.4,
    strokeLinecap: 'square',
  }, 0.8, 0.8)

  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'left-top-finial',
    cx: FRAME_X + 10,
    cy: topY + 12,
    r: 5.2,
    fill: '#FAFAFA',
    stroke: COLOR_INK,
    strokeWidth: 2.2,
  }, 0.8, 0.8)
  pushShadowCircle(primitives, {
    kind: 'circle',
    id: 'right-top-finial',
    cx: FRAME_X + FRAME_WIDTH - 10,
    cy: topY + 12,
    r: 5.2,
    fill: '#FAFAFA',
    stroke: COLOR_INK,
    strokeWidth: 2.2,
  }, 0.8, 0.8)

  return primitives
}

function buildSlidingFrame(config: GateConfig): GateRenderPrimitive[] {
  const trackY = FRAME_Y + FRAME_HEIGHT - 38
  const baseY = FRAME_Y + 36
  const panelHeight = FRAME_HEIGHT - 64
  const panelWidth = FRAME_WIDTH * (config.gateType === 'telescopic_sliding' ? 0.78 : 0.92)
  const panelX = FRAME_X + FRAME_WIDTH - panelWidth - 32
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
    stroke: COLOR_INK,
    strokeWidth: 6,
  })

  primitives.push({
    kind: 'line',
    id: 'track-line',
    x1: FRAME_X + 30,
    y1: trackY,
    x2: FRAME_X + FRAME_WIDTH - 30,
    y2: trackY,
    stroke: COLOR_STEEL,
    strokeWidth: 7,
    strokeLinecap: 'round',
    opacity: 0.9,
  })

  primitives.push({
    kind: 'rect',
    id: 'sliding-panel',
    x: panelX,
    y: panelY,
    width: panelWidth,
    height: panelHeight,
    rx: isRadius ? 80 : 14,
    fill: config.style === 'composite_boards' ? COLOR_PANEL_SOFT : '#FAFAF8',
    stroke: COLOR_INK,
    strokeWidth: 4,
    fillOpacity: 0.95,
  })

  if (isRadius) {
    primitives.push({
      kind: 'path',
      id: 'radius-top',
      d: `M ${panelX + 16} ${panelY + 44} C ${panelX + panelWidth * 0.35} ${panelY - 20}, ${panelX + panelWidth * 0.68} ${panelY - 20}, ${panelX + panelWidth - 16} ${panelY + 44}`,
      fill: 'none',
      stroke: COLOR_RED,
      strokeWidth: 5,
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
        stroke: COLOR_RED,
        strokeWidth: 3,
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
        stroke: COLOR_INK,
        strokeWidth: 4,
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
        fill: COLOR_PANEL,
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
      stroke: COLOR_GOLD,
      strokeWidth: 5,
    })
  }

  if (hasOption(config, 'arched_top')) {
    primitives.push({
      kind: 'path',
      id: 'sliding-arch',
      d: `M ${panelX + 20} ${panelY + 38} C ${panelX + panelWidth * 0.3} ${panelY - 22}, ${panelX + panelWidth * 0.7} ${panelY - 22}, ${panelX + panelWidth - 20} ${panelY + 38}`,
      fill: 'none',
      stroke: COLOR_RED,
      strokeWidth: 5,
    })
  }

  if (hasOption(config, 'top_railheads')) {
    const railheadCount = clamp(Math.round(config.widthMm / 200), 5, 12)
    for (let index = 0; index < railheadCount; index += 1) {
      const ratio = (index + 0.5) / railheadCount
      primitives.push({
        kind: 'circle',
        id: `sliding-top-railhead-${index}`,
        cx: panelX + panelWidth * ratio,
        cy: panelY + 20,
        r: 4,
        fill: COLOR_RED,
        stroke: COLOR_INK,
        strokeWidth: 1,
      })
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    primitives.push({
      kind: 'line',
      id: 'sliding-dog-bar',
      x1: panelX + 18,
      y1: panelY + panelHeight * 0.76,
      x2: panelX + panelWidth - 18,
      y2: panelY + panelHeight * 0.76,
      stroke: COLOR_GOLD,
      strokeWidth: 4,
    })
  }

  if (hasOption(config, 'dog_bars')) {
    const dogBarCount = clamp(2 + Math.round(config.widthMm / 850), 2, 5)
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
        stroke: COLOR_INK,
        strokeWidth: 4,
      })
    }
  }

  if (hasOption(config, 'bushes')) {
    const bushCount = getOptionQuantity(config, 'bushes')
    for (let index = 0; index < bushCount; index += 1) {
      primitives.push({
        kind: 'circle',
        id: `sliding-bush-${index}`,
        cx: panelX + 58 + index * 62,
        cy: panelY + panelHeight * 0.42,
        r: 8,
        fill: COLOR_GOLD,
        fillOpacity: 0.18,
        stroke: COLOR_GOLD,
        strokeWidth: 2,
      })
    }
  }

  if (hasOption(config, 'spirals')) {
    const spiralCount = getOptionQuantity(config, 'spirals')
    for (let index = 0; index < spiralCount; index += 1) {
      const cx = panelX + 58 + index * 62
      primitives.push({
        kind: 'path',
        id: `sliding-spiral-${index}`,
        d: `M ${cx - 8} ${panelY + panelHeight * 0.42 + 24} C ${cx - 8} ${panelY + panelHeight * 0.42 + 2}, ${cx + 10} ${panelY + panelHeight * 0.42 + 2}, ${cx + 10} ${panelY + panelHeight * 0.42 + 24} C ${cx + 10} ${panelY + panelHeight * 0.42 + 46}, ${cx - 6} ${panelY + panelHeight * 0.42 + 46}, ${cx - 6} ${panelY + panelHeight * 0.42 + 24}`,
        fill: 'none',
        stroke: COLOR_RED,
        strokeWidth: 2.4,
      })
    }
  }

  return primitives
}

export function buildGateRenderPlan(config: GateConfig): GateRenderPlan {
  const isSliding = isSlidingGate(config.gateType)
  const title = `${formatTypeLabel(config.gateType)} preview`
  const subtitle = `${config.widthMm} mm wide · ${config.heightMm} mm high · ${config.style.split('_').join(' ')}`
  const notes: string[] = ['2D technical drawing preview']

  if (hasOption(config, 'top_railheads') || hasOption(config, 'dog_bar_railheads')) {
    notes.push('Railheads are shown schematically until the final catalogue is confirmed.')
  }

  if (config.style === 'composite_boards') {
    notes.push('Panel fill is schematic and intentionally clean.')
  }

  const primitives = isSliding ? buildSlidingFrame(config) : buildSwingFrame(config)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-line',
    x1: FRAME_X - 4,
    y1: FRAME_Y + FRAME_HEIGHT + 72,
    x2: FRAME_X + FRAME_WIDTH + 4,
    y2: FRAME_Y + FRAME_HEIGHT + 72,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-line-shadow',
    x1: FRAME_X - 4,
    y1: FRAME_Y + FRAME_HEIGHT + 74,
    x2: FRAME_X + FRAME_WIDTH + 4,
    y2: FRAME_Y + FRAME_HEIGHT + 74,
    stroke: COLOR_SHADOW,
    strokeWidth: 1,
    opacity: 0.5,
  }, 0, 0)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-start',
    x1: FRAME_X,
    y1: FRAME_Y + FRAME_HEIGHT + 58,
    x2: FRAME_X,
    y2: FRAME_Y + FRAME_HEIGHT + 86,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'width-dimension-end',
    x1: FRAME_X + FRAME_WIDTH,
    y1: FRAME_Y + FRAME_HEIGHT + 58,
    x2: FRAME_X + FRAME_WIDTH,
    y2: FRAME_Y + FRAME_HEIGHT + 86,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-line',
    x1: FRAME_X - 70,
    y1: FRAME_Y - 2,
    x2: FRAME_X - 70,
    y2: FRAME_Y + FRAME_HEIGHT + 2,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-line-shadow',
    x1: FRAME_X - 68,
    y1: FRAME_Y - 2,
    x2: FRAME_X - 68,
    y2: FRAME_Y + FRAME_HEIGHT + 2,
    stroke: COLOR_SHADOW,
    strokeWidth: 1,
    opacity: 0.5,
  }, 0, 0)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-start',
    x1: FRAME_X - 86,
    y1: FRAME_Y,
    x2: FRAME_X - 54,
    y2: FRAME_Y,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  pushShadowLine(primitives, {
    kind: 'line',
    id: 'height-dimension-end',
    x1: FRAME_X - 86,
    y1: FRAME_Y + FRAME_HEIGHT,
    x2: FRAME_X - 54,
    y2: FRAME_Y + FRAME_HEIGHT,
    stroke: COLOR_STEEL,
    strokeWidth: 1.8,
    strokeLinecap: 'square',
  }, 1, 1)
  const labels: GateRenderLabel[] = [
    {
      id: 'label-title',
      x: FRAME_X,
      y: FRAME_Y - 46,
      text: title,
      anchor: 'start',
      size: 28,
      fill: COLOR_INK,
      weight: 700,
    },
    {
      id: 'label-subtitle',
      x: FRAME_X,
      y: FRAME_Y - 18,
      text: subtitle,
      anchor: 'start',
      size: 14,
      fill: COLOR_STEEL,
      weight: 500,
    },
    {
      id: 'label-dimensions',
      x: FRAME_X + FRAME_WIDTH - 12,
      y: FRAME_Y + FRAME_HEIGHT + 54,
      text: `${config.widthMm} mm`,
      anchor: 'end',
      size: 18,
      fill: COLOR_RED,
      weight: 700,
    },
    {
      id: 'label-height',
      x: FRAME_X - 78,
      y: FRAME_Y + FRAME_HEIGHT / 2,
      text: `${config.heightMm} mm`,
      anchor: 'end',
      size: 18,
      fill: COLOR_RED,
      weight: 700,
    },
  ]

  if (isSliding) {
    labels.push({
      id: 'label-track',
      x: FRAME_X + 22,
      y: FRAME_Y + FRAME_HEIGHT + 32,
      text: 'Track / rail schematic',
      anchor: 'start',
      size: 13,
      fill: COLOR_STEEL,
      weight: 500,
    })
  }

  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    viewBox: `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`,
    title,
    subtitle,
    notes,
    primitives,
    labels,
  }
}
