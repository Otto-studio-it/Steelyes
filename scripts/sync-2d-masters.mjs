#!/usr/bin/env node
/**
 * Phase 0 — sync photo-locked 2D masters into the web public folder + silhouette index.
 *
 * Source of truth: docs/frontend/2d-masters/
 * Runtime assets:  apps/web/public/2d-masters/
 * Lookup index:    packages/gate-engine/src/silhouettes/silhouette-index.json
 *
 * Policy (locked): Technical preview uses preloaded masters only — never invented CAD.
 * Client-mutable fields stay outside the SVG (widthMm / heightMm UI strip).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const sourceRoot = path.join(root, 'docs/frontend/2d-masters')
const publicRoot = path.join(root, 'apps/web/public/2d-masters')
const indexOut = path.join(root, 'packages/gate-engine/src/silhouettes/silhouette-index.json')

const GATE_PACKS = [
  'double_swing',
  'single_swing',
  'tracked_sliding',
  'cantilever_sliding',
  'bifolding_double_swing',
  'single_bifolding',
  'telescopic_sliding',
  'radius_sliding',
]

function rmAppleDouble(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.name.startsWith('._')) {
      fs.rmSync(full, { force: true })
      continue
    }
    if (entry.isDirectory()) rmAppleDouble(full)
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

function readManifest(gateType) {
  const file = path.join(sourceRoot, gateType, 'manifest.json')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function buildIndex() {
  /** @type {Record<string, unknown>} */
  const packs = {}

  for (const gateType of GATE_PACKS) {
    const manifest = readManifest(gateType)
    if (manifest.status !== 'ready') {
      throw new Error(`Pack ${gateType} status=${manifest.status} — Phase 0 requires ready masters only`)
    }

    const silhouettes = {}
    for (const entry of manifest.silhouettes ?? []) {
      const rel = entry.file
      const abs = path.join(sourceRoot, gateType, rel)
      if (!fs.existsSync(abs)) {
        throw new Error(`Missing silhouette file for ${gateType}/${entry.slug}: ${abs}`)
      }
      const publicPath = `/2d-masters/${gateType}/${rel.replace(/\\/g, '/')}`
      silhouettes[entry.slug] = {
        slug: entry.slug,
        title: entry.title ?? entry.slug,
        publicPath,
        style: entry.style ?? null,
        options: entry.options ?? [],
        includesMotorKit: Boolean(entry.includesMotorKit),
      }
    }

    packs[gateType] = {
      status: manifest.status,
      rules: manifest.lookup?.rules ?? [{ when: {}, slug: 'base' }],
      silhouettes,
    }
  }

  // Railhead overlays (synced for later phases; not required by gate resolve)
  const railManifestPath = path.join(sourceRoot, 'railheads', 'manifest.json')
  let railheads = null
  if (fs.existsSync(railManifestPath)) {
    const railManifest = JSON.parse(fs.readFileSync(railManifestPath, 'utf8'))
    const items = {}
    for (const entry of railManifest.silhouettes ?? []) {
      const abs = path.join(sourceRoot, 'railheads', entry.file)
      if (!fs.existsSync(abs)) {
        throw new Error(`Missing railhead SVG: ${abs}`)
      }
      items[entry.slug] = {
        slug: entry.slug,
        code: entry.code,
        title: entry.title,
        publicPath: `/2d-masters/railheads/${entry.file.replace(/\\/g, '/')}`,
        height_mm: entry.height_mm,
        width_mm: entry.width_mm,
        price_ex_vat_gbp: entry.price_ex_vat_gbp,
        optionKey: entry.optionKey,
      }
    }
    railheads = { status: railManifest.status, silhouettes: items }
  }

  return {
    version: 1,
    updated: new Date().toISOString().slice(0, 10),
    publicBasePath: '/2d-masters',
    policy: {
      technicalSource: 'preloaded_master_only',
      neverInventCad: true,
      clientMutable: ['widthMm', 'heightMm'],
      serving: 'apps/web/public/2d-masters (Option A)',
    },
    packs,
    railheads,
  }
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Missing source root: ${sourceRoot}`)
  }

  fs.rmSync(publicRoot, { recursive: true, force: true })
  fs.mkdirSync(publicRoot, { recursive: true })

  for (const gateType of GATE_PACKS) {
    const from = path.join(sourceRoot, gateType, 'silhouettes')
    const to = path.join(publicRoot, gateType, 'silhouettes')
    if (!fs.existsSync(from)) throw new Error(`Missing ${from}`)
    copyDir(from, to)
  }

  const railFrom = path.join(sourceRoot, 'railheads', 'silhouettes')
  if (fs.existsSync(railFrom)) {
    copyDir(railFrom, path.join(publicRoot, 'railheads', 'silhouettes'))
  }

  rmAppleDouble(publicRoot)

  const index = buildIndex()
  fs.mkdirSync(path.dirname(indexOut), { recursive: true })
  fs.writeFileSync(indexOut, `${JSON.stringify(index, null, 2)}\n`)

  const gateSvgCount = GATE_PACKS.reduce(
    (n, g) => n + Object.keys(index.packs[g].silhouettes).length,
    0,
  )
  const railCount = index.railheads ? Object.keys(index.railheads.silhouettes).length : 0

  console.log(`Synced 2D masters → ${path.relative(root, publicRoot)}`)
  console.log(`Index → ${path.relative(root, indexOut)}`)
  console.log(`Gate silhouettes: ${gateSvgCount}; railhead overlays: ${railCount}`)
}

main()
