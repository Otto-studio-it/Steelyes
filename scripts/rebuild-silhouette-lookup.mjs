#!/usr/bin/env node
/**
 * Rebuild tipology-preserving lookup rules for every gate pack in silhouette-index.json
 * and mirror rules into docs/frontend/2d-masters/{gate}/manifest.json.
 *
 * Does NOT delete/re-copy SVG assets — only rewrites rules.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildLookupRules } from './lib/silhouette-lookup.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const indexPath = path.join(root, 'packages/gate-engine/src/silhouettes/silhouette-index.json')
const docsRoot = path.join(root, 'docs/frontend/2d-masters')

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))

for (const [gateType, pack] of Object.entries(index.packs)) {
  const slugs = Object.keys(pack.silhouettes)
  const rules = buildLookupRules(slugs)
  pack.rules = rules
  console.log(`${gateType}: ${slugs.length} silhouettes → ${rules.length} rules`)

  const manifestPath = path.join(docsRoot, gateType, 'manifest.json')
  if (!fs.existsSync(manifestPath)) continue
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  manifest.lookup = {
    description:
      'Most-specific matching rule wins (engine scores options/withoutOptions). Baked deco first; tipology fallbacks preserve arched/dog_bars when deco masters are missing.',
    rules,
  }
  // Keep silhouette file list in sync with index entries (publicPath → file)
  manifest.silhouettes = slugs
    .filter((slug) => !slug.endsWith('_motorised') || true)
    .map((slug) => {
      const entry = pack.silhouettes[slug]
      return {
        slug: entry.slug,
        title: entry.title,
        file: entry.publicPath.replace(`/2d-masters/${gateType}/`, ''),
        style: entry.style,
        options: entry.options ?? [],
        ...(entry.includesMotorKit ? { includesMotorKit: true } : {}),
      }
    })
  manifest.updated = new Date().toISOString().slice(0, 10)
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

index.updated = new Date().toISOString().slice(0, 10)
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
console.log(`Updated ${path.relative(root, indexPath)}`)
