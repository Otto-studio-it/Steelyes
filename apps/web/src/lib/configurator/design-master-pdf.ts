import fs from 'node:fs'
import path from 'node:path'

import { Resvg } from '@resvg/resvg-js'
import {
  resolveCircleOverlays,
  resolveCollarOverlays,
  resolveSilhouette,
  type GateConfig,
} from '@steelyes/gate-engine'

function publicFsPath(publicPath: string): string {
  return path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
}

function svgInner(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/^[\s\S]*?<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .trim()
}

function appendOverlaySvgs(baseSvg: string, overlaySvgs: string[]): string {
  if (overlaySvgs.length === 0) return baseSvg
  const open = baseSvg.match(/^[\s\S]*?<svg[^>]*>/i)?.[0]
  if (!open) return baseSvg
  return `${open}\n${svgInner(baseSvg)}\n${overlaySvgs.map(svgInner).join('\n')}\n</svg>\n`
}

export type DesignMasterRaster = {
  slug: string
  publicPath: string
  png: Uint8Array
}

/**
 * Same drawing the Design UI shows: official master + overlay fallbacks.
 * Used by the quote PDF so the customer and Marius see one elevation.
 */
export function rasterizeDesignMaster(config: GateConfig): DesignMasterRaster {
  const resolved = resolveSilhouette(config)
  const fsPath = publicFsPath(resolved.publicPath)
  if (!fs.existsSync(fsPath)) {
    throw new Error(`Design master file missing: ${resolved.publicPath}`)
  }

  let svg = fs.readFileSync(fsPath, 'utf8')
  const overlays: string[] = []

  if (!resolved.bakedOptions.includes('circles')) {
    for (const band of resolveCircleOverlays(config).bands) {
      const overlayPath = publicFsPath(band.publicPath)
      if (fs.existsSync(overlayPath)) overlays.push(fs.readFileSync(overlayPath, 'utf8'))
    }
  }

  if (!resolved.bakedOptions.includes('picket_collars')) {
    for (const overlay of resolveCollarOverlays(config).overlays) {
      const overlayPath = publicFsPath(overlay.publicPath)
      if (fs.existsSync(overlayPath)) overlays.push(fs.readFileSync(overlayPath, 'utf8'))
    }
  }

  svg = appendOverlaySvgs(svg, overlays)

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#ffffff',
  })
    .render()
    .asPng()

  return {
    slug: resolved.slug,
    publicPath: resolved.publicPath,
    png,
  }
}
