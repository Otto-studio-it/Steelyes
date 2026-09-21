export const POST_MATERIALS = ['none', 'steel', 'brick', 'stone', 'timber'] as const

export type PostMaterial = (typeof POST_MATERIALS)[number]

export const POST_CAP_STYLES = ['flat', 'ball', 'pyramid', 'spear'] as const

export type PostCapStyle = (typeof POST_CAP_STYLES)[number]

export const MAX_POST_EXTENSION_MM = 400

export type GatePostsConfig = {
  enabled: boolean
  material: PostMaterial
  capStyle: PostCapStyle
  /** Height the post extends above the gate frame (mm). */
  extendAboveGateMm: number
}

export const DEFAULT_GATE_POSTS: GatePostsConfig = {
  enabled: true,
  material: 'steel',
  capStyle: 'ball',
  extendAboveGateMm: 120,
}

export const POST_MATERIAL_LABELS: Record<PostMaterial, string> = {
  none: 'No posts (opening only)',
  steel: 'Steel post (powder coated)',
  brick: 'Brick pillar',
  stone: 'Stone pillar',
  timber: 'Timber post',
}

export const POST_CAP_LABELS: Record<PostCapStyle, string> = {
  flat: 'Flat cap',
  ball: 'Ball finial',
  pyramid: 'Pyramid cap',
  spear: 'Spear finial',
}

export type PostMaterialPalette = {
  fill: string
  stroke: string
  accent: string
}

export function resolvePostMaterialPalette(material: PostMaterial, gateFinishStroke: string): PostMaterialPalette {
  switch (material) {
    case 'steel':
      return { fill: '#2A2A2A', stroke: gateFinishStroke, accent: '#4A4A4A' }
    case 'brick':
      return { fill: '#8B4A3A', stroke: '#5C2E22', accent: '#A65A48' }
    case 'stone':
      return { fill: '#9A958C', stroke: '#6E6A62', accent: '#B8B2A8' }
    case 'timber':
      return { fill: '#7A5C3E', stroke: '#4E3824', accent: '#9A744E' }
    default:
      return { fill: 'transparent', stroke: 'transparent', accent: 'transparent' }
  }
}

export function normalizeGatePosts(input: unknown): GatePostsConfig {
  if (typeof input !== 'object' || input === null) {
    return structuredClone(DEFAULT_GATE_POSTS)
  }

  const raw = input as Partial<GatePostsConfig>
  const material =
    typeof raw.material === 'string' && (POST_MATERIALS as readonly string[]).includes(raw.material)
      ? raw.material
      : DEFAULT_GATE_POSTS.material
  const capStyle =
    typeof raw.capStyle === 'string' && (POST_CAP_STYLES as readonly string[]).includes(raw.capStyle)
      ? raw.capStyle
      : DEFAULT_GATE_POSTS.capStyle
  const extend =
    typeof raw.extendAboveGateMm === 'number' && Number.isFinite(raw.extendAboveGateMm)
      ? Math.min(MAX_POST_EXTENSION_MM, Math.max(0, Math.round(raw.extendAboveGateMm)))
      : DEFAULT_GATE_POSTS.extendAboveGateMm

  return {
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : DEFAULT_GATE_POSTS.enabled,
    material,
    capStyle,
    extendAboveGateMm: extend,
  }
}
