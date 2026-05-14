import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = process.cwd()
const IMAGE_ROOT = path.join(ROOT, 'apps/web/public/images')
const SOURCE_ROOT = path.join(ROOT, 'apps/web/src')
const OUTPUT_MD = path.join(ROOT, 'docs/frontend/photo-audit.md')
const OUTPUT_JSON = path.join(ROOT, 'docs/frontend/photo-audit.json')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic'])
const ROLE_KEYWORDS = [
  { tokens: ['welding', 'workshop'], role: 'fabrication / workshop', page: 'home, about, gallery fabrication' },
  { tokens: ['steelwork', 'finial', 'detail'], role: 'craft detail / proof of finish', page: 'home, gallery fabrication' },
  { tokens: ['structure'], role: 'structural steel / balcony / platform', page: 'services/structures, services/balconies, gallery fabrication' },
  { tokens: ['balcony'], role: 'balconies / terraces', page: 'services/balconies, services/structures, gallery' },
  { tokens: ['railings'], role: 'railings / balustrades', page: 'services/railings, gallery' },
  { tokens: ['gate'], role: 'gate hero / gate card', page: 'home, gates, gallery' },
  { tokens: ['finial'], role: 'detail / ornamental close-up', page: 'gates detail, gallery fabrication' },
  { tokens: ['component'], role: 'detail / supporting close-up', page: 'gates detail, gallery fabrication' },
]

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    if (entry.name.startsWith('._')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(full))
      continue
    }
    const ext = path.extname(entry.name).toLowerCase()
    if (IMAGE_EXTS.has(ext)) out.push(full)
  }
  return out
}

function walkSourceFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.turbo', 'playwright-report', 'test-results'].includes(entry.name)) continue
      out.push(...walkSourceFiles(full))
      continue
    }
    if (/\.(ts|tsx|js|jsx|md|mdx|json)$/i.test(entry.name)) out.push(full)
  }
  return out
}

function runSips(file) {
  try {
    const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
    const widthMatch = output.match(/pixelWidth:\s+(\d+)/)
    const heightMatch = output.match(/pixelHeight:\s+(\d+)/)
    return {
      width: widthMatch ? Number(widthMatch[1]) : null,
      height: heightMatch ? Number(heightMatch[1]) : null,
    }
  } catch {
    return { width: null, height: null }
  }
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function inferCategory(relPath) {
  const parts = relPath.split('/')
  if (parts.includes('gates')) return 'gates'
  if (parts.includes('railings')) return 'railings'
  if (parts.includes('balconies')) return 'balconies'
  if (parts.includes('components')) return 'components'
  if (parts.includes('home')) return 'home'
  if (parts.includes('client-uploads')) return 'client-uploads'
  return 'other'
}

function inferRole(relPath) {
  const lower = relPath.toLowerCase()
  for (const entry of ROLE_KEYWORDS) {
    if (entry.tokens.every((token) => lower.includes(token))) {
      return entry
    }
  }

  if (lower.includes('/gates/')) {
    return { role: 'gate hero / gate card', page: 'home, gates, gallery' }
  }
  if (lower.includes('/railings/')) {
    return { role: 'railings / balustrades', page: 'services/railings, gallery' }
  }
  if (lower.includes('/balconies/')) {
    return { role: 'balconies / terraces', page: 'services/balconies, services/structures, gallery' }
  }
  if (lower.includes('/components/')) {
    return { role: 'detail / supporting close-up', page: 'gates detail, gallery fabrication' }
  }
  if (lower.includes('home-welding')) {
    return { role: 'fabrication / workshop', page: 'home, about, gallery fabrication' }
  }

  return { role: 'general asset', page: 'gallery' }
}

function escapeMd(text) {
  return String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function formatPercent(n) {
  return `${(n * 100).toFixed(1)}%`
}

const imageFiles = walkFiles(IMAGE_ROOT)
const sourceFiles = walkSourceFiles(SOURCE_ROOT)
const sourceText = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n\n')

const assets = imageFiles.map((file) => {
  const stat = fs.statSync(file)
  const rel = path.relative(path.join(ROOT, 'apps/web/public'), file).split(path.sep).join('/')
  const refs = (sourceText.match(new RegExp(rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  const { width, height } = runSips(file)
  const category = inferCategory(rel)
  const role = inferRole(rel)
  const area = width && height ? width * height : null
  const aspect = width && height ? (width / height).toFixed(2) : null

  return {
    file: rel,
    sizeBytes: stat.size,
    sizeHuman: humanSize(stat.size),
    width,
    height,
    aspect,
    category,
    refs,
    role: role.role,
    recommendedPages: role.page,
    area,
  }
})

const totalBytes = assets.reduce((sum, asset) => sum + asset.sizeBytes, 0)
const usedAssets = assets.filter((asset) => asset.refs > 0)
const unusedAssets = assets.filter((asset) => asset.refs === 0)
const byCategory = Object.groupBy(assets, (asset) => asset.category)

const topReferenced = [...assets]
  .sort((a, b) => b.refs - a.refs || b.sizeBytes - a.sizeBytes)
  .slice(0, 12)

const largestAssets = [...assets]
  .sort((a, b) => b.sizeBytes - a.sizeBytes)
  .slice(0, 12)

const markdown = []
markdown.push('# Steelyes Photo Audit')
markdown.push('')
markdown.push(`Generated: ${new Date().toISOString()}`)
markdown.push('')
markdown.push('## Summary')
markdown.push('')
markdown.push(`- Total images: ${assets.length}`)
markdown.push(`- Used by the site: ${usedAssets.length}`)
markdown.push(`- Unused in source: ${unusedAssets.length}`)
markdown.push(`- Total image payload in public/images: ${humanSize(totalBytes)}`)
markdown.push('')
markdown.push('## What the client is asking for')
markdown.push('')
markdown.push('- Do not read like a gate-only site.')
markdown.push('- Show fabrication, not only finished gates.')
markdown.push('- Make gallery and portfolio visibly larger.')
markdown.push('')
markdown.push('## Immediate recommendations')
markdown.push('')
markdown.push('- Keep gate hero imagery on home, but pair it with fabrication, railings and balcony proof.')
markdown.push('- Push `fabrication` assets into `home`, `about`, `gallery`, `services/staircases`, and `services/structures`.')
markdown.push('- Reserve gate-only close-ups for gate pages and the top gallery grid.')
markdown.push('- Use balcony and railings images to broaden the portfolio language away from gates.')
markdown.push('')
markdown.push('## Top referenced assets')
markdown.push('')
markdown.push('| File | Refs | Size | Dimensions | Best role |')
markdown.push('| --- | ---: | ---: | --- | --- |')
for (const asset of topReferenced) {
  markdown.push(`| ${escapeMd(asset.file)} | ${asset.refs} | ${asset.sizeHuman} | ${asset.width ?? '-'}x${asset.height ?? '-'} | ${escapeMd(asset.role)} |`)
}
markdown.push('')
markdown.push('## Largest assets')
markdown.push('')
markdown.push('| File | Size | Dimensions | Category | Refs |')
markdown.push('| --- | ---: | --- | --- | ---: |')
for (const asset of largestAssets) {
  markdown.push(`| ${escapeMd(asset.file)} | ${asset.sizeHuman} | ${asset.width ?? '-'}x${asset.height ?? '-'} | ${asset.category} | ${asset.refs} |`)
}
markdown.push('')
markdown.push('## Inventory by category')
markdown.push('')
for (const category of Object.keys(byCategory).sort()) {
  const items = byCategory[category] || []
  const bytes = items.reduce((sum, item) => sum + item.sizeBytes, 0)
  markdown.push(`### ${category}`)
  markdown.push('')
  markdown.push(`- Count: ${items.length}`)
  markdown.push(`- Total size: ${humanSize(bytes)}`)
  markdown.push('')
  markdown.push('| File | Refs | Role | Recommended pages |')
  markdown.push('| --- | ---: | --- | --- |')
  for (const asset of items.sort((a, b) => a.file.localeCompare(b.file))) {
    markdown.push(`| ${escapeMd(asset.file)} | ${asset.refs} | ${escapeMd(asset.role)} | ${escapeMd(asset.recommendedPages)} |`)
  }
  markdown.push('')
}
markdown.push('## Unused assets')
markdown.push('')
if (unusedAssets.length === 0) {
  markdown.push('No unused image assets were found in `apps/web/public/images`.')
} else {
  markdown.push('| File | Size | Category |')
  markdown.push('| --- | ---: | --- |')
  for (const asset of unusedAssets.sort((a, b) => a.file.localeCompare(b.file))) {
    markdown.push(`| ${escapeMd(asset.file)} | ${asset.sizeHuman} | ${asset.category} |`)
  }
}
markdown.push('')
markdown.push('## Suggested next move')
markdown.push('')
markdown.push('Use this report to build a real photo-selection pass: first choose 6-8 fabrication assets, then map them into home, gallery and the non-gate service pages.')
markdown.push('')

fs.mkdirSync(path.dirname(OUTPUT_MD), { recursive: true })
fs.writeFileSync(OUTPUT_MD, markdown.join('\n'), 'utf8')
fs.writeFileSync(
  OUTPUT_JSON,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        totalImages: assets.length,
        usedAssets: usedAssets.length,
        unusedAssets: unusedAssets.length,
        totalBytes,
      },
      assets,
    },
    null,
    2,
  ),
  'utf8',
)

console.log(`Wrote ${OUTPUT_MD}`)
console.log(`Wrote ${OUTPUT_JSON}`)
console.log(`Images: ${assets.length}, used: ${usedAssets.length}, unused: ${unusedAssets.length}`)
console.log(`Total payload: ${humanSize(totalBytes)}`)
