#!/usr/bin/env node
/**
 * Bake missing Victorian deco cells by compositing the tipology master
 * with the existing circle/collar overlay SVGs (same 1200×860 paper).
 *
 * Does not invent CAD. Does not replace Figma-tuned files that already exist.
 * Run: node scripts/bake-missing-2d-masters.mjs
 * Then: pnpm sync:2d-masters
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const sourceRoot = path.join(root, 'docs/frontend/2d-masters')
const overlayRoot = path.join(sourceRoot, 'overlays')

/** @typedef {{ gateType: string, slug: string, base: string, circles?: boolean, collar?: boolean }} MissingCell */

const MISSING = [
  { gateType: 'tracked_sliding', slug: 'base_circles', base: 'base', circles: true },
  { gateType: 'tracked_sliding', slug: 'arched_circles', base: 'arched', circles: true },
  {
    gateType: 'bifolding_double_swing',
    slug: 'arched_dog_bars_circles_motorised',
    base: 'arched_dog_bars_motorised',
    circles: true,
  },
  {
    gateType: 'bifolding_double_swing',
    slug: 'arched_dog_bars_collar_1',
    base: 'arched_dog_bars',
    collar: true,
  },
  {
    gateType: 'bifolding_double_swing',
    slug: 'arched_dog_bars_collar_1_motorised',
    base: 'arched_dog_bars_motorised',
    collar: true,
  },
  {
    gateType: 'single_bifolding',
    slug: 'dog_bars_collar_1_motorised',
    base: 'dog_bars_motorised',
    collar: true,
  },
  {
    gateType: 'single_bifolding',
    slug: 'arched_dog_bars_circles_collar_1_motorised',
    base: 'arched_dog_bars_motorised',
    circles: true,
    collar: true,
  },
  { gateType: 'telescopic_sliding', slug: 'base_circles', base: 'base', circles: true },
  {
    gateType: 'telescopic_sliding',
    slug: 'base_circles_collar_1',
    base: 'base',
    circles: true,
    collar: true,
  },
  {
    gateType: 'telescopic_sliding',
    slug: 'arched_circles_collar_1',
    base: 'arched',
    circles: true,
    collar: true,
  },
  { gateType: 'telescopic_sliding', slug: 'dog_bars_circles', base: 'dog_bars', circles: true },
  { gateType: 'telescopic_sliding', slug: 'dog_bars_collar_1', base: 'dog_bars', collar: true },
  {
    gateType: 'telescopic_sliding',
    slug: 'dog_bars_circles_collar_1',
    base: 'dog_bars',
    circles: true,
    collar: true,
  },
  {
    gateType: 'telescopic_sliding',
    slug: 'arched_dog_bars_circles',
    base: 'arched_dog_bars',
    circles: true,
  },
  { gateType: 'radius_sliding', slug: 'arched_collar_1', base: 'arched', collar: true },
  { gateType: 'radius_sliding', slug: 'dog_bars_collar_1', base: 'dog_bars', collar: true },
]

function svgInner(svg, idPrefix) {
  let inner = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/^[\s\S]*?<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')

  if (idPrefix) {
    inner = inner
      .replaceAll('id="', `id="${idPrefix}`)
      .replaceAll('url(#', `url(#${idPrefix}`)
  }

  return inner.trim()
}

function overlayPath(kind, arched) {
  if (kind === 'circles') {
    return path.join(
      overlayRoot,
      'circles',
      arched ? 'bands_combined_arched.svg' : 'bands_combined.svg',
    )
  }
  return path.join(overlayRoot, 'collar', 'row_every_1.svg')
}

function composeMaster(baseSvg, overlays) {
  const open = baseSvg.match(/^[\s\S]*?<svg[^>]*>/i)?.[0]
  if (!open) {
    throw new Error('Base SVG has no opening <svg>')
  }

  const innerBase = svgInner(baseSvg, '')
  const overlayInner = overlays
    .map((item, index) => `<!-- baked overlay ${index + 1}: ${item.label} -->\n${svgInner(item.svg, `ov${index}_`)}`)
    .join('\n')

  return `${open}
<!-- baked missing cell — tipology master + official overlay SVGs; not invented CAD -->
${innerBase}
${overlayInner}
</svg>
`
}

function main() {
  const written = []
  const skipped = []

  for (const cell of MISSING) {
    const dest = path.join(sourceRoot, cell.gateType, 'silhouettes', `${cell.slug}.svg`)
    if (fs.existsSync(dest) && !process.argv.includes('--force')) {
      skipped.push(`${cell.gateType}/${cell.slug}`)
      continue
    }

    const baseFile = path.join(sourceRoot, cell.gateType, 'silhouettes', `${cell.base}.svg`)
    if (!fs.existsSync(baseFile)) {
      throw new Error(`Missing tipology source ${baseFile}`)
    }

    const arched = cell.base.includes('arched')
    /** @type {{ label: string, svg: string }[]} */
    const overlays = []
    if (cell.circles) {
      overlays.push({
        label: arched ? 'circles arched' : 'circles',
        svg: fs.readFileSync(overlayPath('circles', arched), 'utf8'),
      })
    }
    if (cell.collar) {
      overlays.push({
        label: 'collar every_1',
        svg: fs.readFileSync(overlayPath('collar', false), 'utf8'),
      })
    }

    const composed = composeMaster(fs.readFileSync(baseFile, 'utf8'), overlays)
    fs.writeFileSync(dest, composed)
    written.push(`${cell.gateType}/${cell.slug}`)
  }

  console.log(`Baked ${written.length} missing masters`)
  for (const item of written) console.log(`  + ${item}`)
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} existing files (pass --force to overwrite)`)
  }
}

main()
