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

export type GateRenderViewMode = 'installation' | 'technical' | 'plan'

export type GateRenderPlan = {
  width: number
  height: number
  viewBox: string
  viewMode: GateRenderViewMode
  title: string
  subtitle: string
  notes: string[]
  background: GateRenderPrimitive[]
  primitives: GateRenderPrimitive[]
  labels: GateRenderLabel[]
}
