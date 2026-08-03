import { normalizeGatePosts, resolvePostMaterialPalette, type GatePostsConfig, type PostCapStyle } from '../posts'
import type { GateConfig } from '../types'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateRenderLabel, GateRenderPrimitive } from './render-plan'

export type GateRenderViewMode = 'installation' | 'technical'

export type SceneFrameBounds = {
  frameX: number
  frameY: number
  frameWidth: number
  frameHeight: number
}

export type ScenePalette = {
  ink: string
  accent: string
  steel: string
  shadow: string
  postFill: string
}

function scaleVisual(value: number): number {
  return scaleVisualBoldness(value)
}

export function buildInstallationBackground(
  canvasWidth: number,
  canvasHeight: number,
): GateRenderPrimitive[] {
  return [
    {
      kind: 'rect',
      id: 'sky-top',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight * 0.55,
      fill: '#DCE8F2',
      stroke: 'none',
    },
    {
      kind: 'rect',
      id: 'sky-horizon',
      x: 0,
      y: canvasHeight * 0.42,
      width: canvasWidth,
      height: canvasHeight * 0.18,
      fill: '#EEF4F8',
      stroke: 'none',
      opacity: 0.85,
    },
    {
      kind: 'rect',
      id: 'ground-grass',
      x: 0,
      y: canvasHeight * 0.58,
      width: canvasWidth,
      height: canvasHeight * 0.42,
      fill: '#D8E2CF',
      stroke: 'none',
    },
    {
      kind: 'rect',
      id: 'driveway',
      x: canvasWidth * 0.08,
      y: canvasHeight * 0.72,
      width: canvasWidth * 0.84,
      height: canvasHeight * 0.2,
      rx: 8,
      fill: '#C9C3BA',
      stroke: 'none',
      opacity: 0.55,
    },
    {
      kind: 'line',
      id: 'ground-line',
      x1: 0,
      y1: canvasHeight * 0.72,
      x2: canvasWidth,
      y2: canvasHeight * 0.72,
      stroke: 'rgba(27,28,26,0.12)',
      strokeWidth: 2,
    },
  ]
}

function pushMaterialTexture(
  primitives: GateRenderPrimitive[],
  material: GatePostsConfig['material'],
  x: number,
  y: number,
  width: number,
  height: number,
  palette: ReturnType<typeof resolvePostMaterialPalette>,
): void {
  if (material === 'brick') {
    const rowHeight = scaleVisual(14)
    for (let row = 0; row < Math.ceil(height / rowHeight); row += 1) {
      const offset = row % 2 === 0 ? 0 : width * 0.12
      primitives.push({
        kind: 'line',
        id: `post-texture-brick-row-${row}-${x}`,
        x1: x + offset,
        y1: y + row * rowHeight,
        x2: x + width - offset,
        y2: y + row * rowHeight,
        stroke: palette.accent,
        strokeWidth: 1.2,
        opacity: 0.35,
      })
    }
  }

  if (material === 'stone') {
    for (let i = 0; i < 5; i += 1) {
      primitives.push({
        kind: 'line',
        id: `post-texture-stone-${i}-${x}`,
        x1: x + 4,
        y1: y + height * (0.15 + i * 0.16),
        x2: x + width - 4,
        y2: y + height * (0.18 + i * 0.16),
        stroke: palette.accent,
        strokeWidth: 1,
        opacity: 0.28,
        strokeDasharray: '6 8',
      })
    }
  }

  if (material === 'timber') {
    for (let i = 0; i < 4; i += 1) {
      primitives.push({
        kind: 'line',
        id: `post-texture-timber-${i}-${x}`,
        x1: x + width * 0.2,
        y1: y + 8 + i * scaleVisual(18),
        x2: x + width * 0.8,
        y2: y + 8 + i * scaleVisual(18),
        stroke: palette.accent,
        strokeWidth: 1.4,
        opacity: 0.4,
      })
    }
  }
}

function buildPostCapPrimitive(
  id: string,
  capStyle: PostCapStyle,
  centerX: number,
  topY: number,
  postWidth: number,
  palette: ReturnType<typeof resolvePostMaterialPalette>,
  gatePalette: ScenePalette,
): GateRenderPrimitive[] {
  const capSize = scaleVisual(16)
  switch (capStyle) {
    case 'ball':
      return [
        {
          kind: 'circle',
          id: `${id}-ball`,
          cx: centerX,
          cy: topY - capSize * 0.35,
          r: capSize * 0.55,
          fill: gatePalette.postFill,
          stroke: gatePalette.ink,
          strokeWidth: scaleVisual(2.5),
        },
      ]
    case 'pyramid':
      return [
        {
          kind: 'path',
          id: `${id}-pyramid`,
          d: `M ${centerX - capSize * 0.7} ${topY} L ${centerX} ${topY - capSize} L ${centerX + capSize * 0.7} ${topY} Z`,
          fill: palette.fill,
          stroke: gatePalette.ink,
          strokeWidth: scaleVisual(2),
        },
      ]
    case 'spear':
      return [
        {
          kind: 'path',
          id: `${id}-spear`,
          d: `M ${centerX} ${topY - capSize * 1.2} L ${centerX - capSize * 0.35} ${topY - capSize * 0.2} L ${centerX + capSize * 0.35} ${topY - capSize * 0.2} Z`,
          fill: gatePalette.postFill,
          stroke: gatePalette.ink,
          strokeWidth: scaleVisual(2),
        },
      ]
    default:
      return [
        {
          kind: 'rect',
          id: `${id}-flat-cap`,
          x: centerX - postWidth / 2 - 2,
          y: topY - scaleVisual(8),
          width: postWidth + 4,
          height: scaleVisual(8),
          fill: palette.fill,
          stroke: gatePalette.ink,
          strokeWidth: scaleVisual(2),
        },
      ]
  }
}

export function buildMountingPosts(
  config: GateConfig,
  bounds: SceneFrameBounds,
  palette: ScenePalette,
): GateRenderPrimitive[] {
  const posts = normalizeGatePosts(config.posts)
  if (!posts.enabled || posts.material === 'none') {
    return []
  }

  const postWidth = scaleVisual(posts.material === 'brick' || posts.material === 'stone' ? 52 : 42)
  const extendPx = scaleVisual(posts.extendAboveGateMm * 0.08)
  const postTop = bounds.frameY - extendPx - scaleVisual(8)
  const postBottom = bounds.frameY + bounds.frameHeight + scaleVisual(28)
  const postHeight = postBottom - postTop
  const leftX = bounds.frameX - scaleVisual(28)
  const rightX = bounds.frameX + bounds.frameWidth - postWidth + scaleVisual(28)
  const materialPalette = resolvePostMaterialPalette(posts.material, palette.ink)
  const primitives: GateRenderPrimitive[] = []

  for (const [side, x] of [
    ['left', leftX],
    ['right', rightX],
  ] as const) {
    primitives.push({
      kind: 'rect',
      id: `${side}-mount-post-shadow`,
      x: x + 4,
      y: postTop + 6,
      width: postWidth,
      height: postHeight,
      rx: posts.material === 'steel' ? 2 : 4,
      fill: palette.shadow,
      stroke: 'none',
      opacity: 0.25,
    })
    primitives.push({
      kind: 'rect',
      id: `${side}-mount-post`,
      x,
      y: postTop,
      width: postWidth,
      height: postHeight,
      rx: posts.material === 'steel' ? 2 : 4,
      fill: materialPalette.fill,
      stroke: materialPalette.stroke,
      strokeWidth: scaleVisual(posts.material === 'steel' ? 3.5 : 2.5),
    })
    pushMaterialTexture(primitives, posts.material, x, postTop, postWidth, postHeight, materialPalette)
    primitives.push(
      ...buildPostCapPrimitive(
        `${side}-post-cap`,
        posts.capStyle,
        x + postWidth / 2,
        postTop,
        postWidth,
        materialPalette,
        palette,
      ),
    )
  }

  return primitives
}

export function buildGateShadow(bounds: SceneFrameBounds): GateRenderPrimitive {
  return {
    kind: 'rect',
    id: 'gate-ground-shadow',
    x: bounds.frameX + 20,
    y: bounds.frameY + bounds.frameHeight + 8,
    width: bounds.frameWidth - 40,
    height: scaleVisual(18),
    rx: 40,
    fill: 'rgba(0,0,0,0.14)',
    stroke: 'none',
  }
}

export function filterInstallationLabels(labels: GateRenderLabel[]): GateRenderLabel[] {
  return labels.filter(
    (label) =>
      label.id === 'label-posts' ||
      label.id === 'label-track' ||
      label.id === 'label-tail' ||
      label.id === 'label-bifold-fold' ||
      label.id === 'label-telescopic' ||
      label.id === 'label-radius',
  )
}
