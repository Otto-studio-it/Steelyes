'use client'

import { useState, useTransition } from 'react'

import { upsertFencingPanel } from '@/app/admin/fencing/actions'
import { updateGateOption } from '@/app/admin/gate-options/actions'
import { updateGatePrice } from '@/app/admin/gates/actions'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import { formatFinishLabel, humanizeSlug } from '@/lib/admin/format'
import { cn } from '@/lib/utils'

export type IntakeGateSeed = {
  status: string
  source: string
  choice: string | null
  note: string
  victorian_auto_gbp: number | null
  victorian_manual_gbp: number | null
  composite_auto_gbp: number | null
  composite_manual_gbp: number | null
}

type GateRow = {
  id: string
  name: string
  type: string
  style: string
  finish: string
  min_width_mm: number
  min_height_mm: number
  base_price_manual_gbp: number
  base_price_auto_gbp: number | null
}

type OptionRow = {
  id: string
  slug: string
  name: string
  flat_price_gbp: number
  per_unit_price_gbp: number | null
  unit_type: string | null
  notes: string | null
}

type FencingRow = {
  id: string
  style: string
  finish: string
  base_price_gbp: number
  price_per_m2_gbp: number
  notes: string | null
}

type Props = {
  gates: GateRow[]
  options: OptionRow[]
  fencing: FencingRow[]
  intakeSeeds: Record<string, IntakeGateSeed>
}

type Tab = 'gates' | 'options' | 'fencing'

const GATE_TYPE_LABEL: Record<string, string> = {
  'double-swing': 'Double Swing',
  'single-swing': 'Single Swing',
  sliding: 'Tracked Sliding',
  cantilevered: 'Cantilever Sliding',
  bifolding: 'Bifolding Double',
  'bifolding-single': 'Single Bifolding',
  telescopic: 'Telescopic Sliding',
  'sliding-radius': 'Radius Sliding',
}

export function ListinoBoard({ gates, options, fencing, intakeSeeds }: Props) {
  const [tab, setTab] = useState<Tab>('gates')

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'gates', label: 'Cancelli', count: gates.length },
    { id: 'options', label: 'Addon', count: options.length },
    { id: 'fencing', label: 'Recinzioni', count: fencing.length },
  ]

  return (
    <div className="mt-6">
      <div className="flex gap-1 border-b border-zinc-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'min-h-[44px] px-4 font-heading text-sm font-bold uppercase tracking-tight transition-colors',
              tab === t.id
                ? 'border-b-2 border-[#9e000c] text-[#9e000c]'
                : 'text-zinc-500 hover:text-[#1b1c1a]',
            )}
          >
            {t.label} <span className="font-mono text-[10px] text-zinc-400">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'gates' && <GatesTable gates={gates} intakeSeeds={intakeSeeds} />}
      {tab === 'options' && <OptionsTable options={options} />}
      {tab === 'fencing' && <FencingTable fencing={fencing} />}
    </div>
  )
}

// ── Cancelli ─────────────────────────────────────────────────────────────────

function GatesTable({
  gates,
  intakeSeeds,
}: {
  gates: GateRow[]
  intakeSeeds: Record<string, IntakeGateSeed>
}) {
  const byType = new Map<string, GateRow[]>()
  for (const g of gates) {
    const list = byType.get(g.type) ?? []
    list.push(g)
    byType.set(g.type, list)
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {Array.from(byType.entries()).map(([type, rows]) => {
        const seed = intakeSeeds[type]
        return (
          <section key={type} className="border border-zinc-200 bg-white">
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-100 px-4 py-3">
              <h2 className="font-heading text-base font-bold uppercase tracking-tight text-[#1b1c1a]">
                {GATE_TYPE_LABEL[type] ?? humanizeSlug(type)}
              </h2>
              {seed && <IntakeChip seed={seed} />}
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                    <th className="px-4 py-2 font-normal">Variante</th>
                    <th className="px-2 py-2 font-normal">Min W×H</th>
                    <th className="px-2 py-2 font-normal">Manual £</th>
                    <th className="px-2 py-2 font-normal">Auto £</th>
                    <th className="px-2 py-2 font-normal">Da Marius</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((g) => (
                    <GateRowEditor key={g.id} gate={g} seed={seed} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
      {byType.size === 0 && (
        <p className="mt-4 font-mono text-sm text-zinc-400">
          Nessun cancello nel DB — applica le migrations.
        </p>
      )}
    </div>
  )
}

function IntakeChip({ seed }: { seed: IntakeGateSeed }) {
  const label =
    seed.choice === 'confirm'
      ? 'Confermato da Marius'
      : seed.choice === 'correct'
        ? 'Corretto da Marius — leggi nota'
        : seed.choice === 'unsure'
          ? 'Marius non è sicuro'
          : 'In attesa di conferma'
  const tone =
    seed.choice === 'confirm'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : seed.choice === 'correct'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-zinc-200 bg-zinc-50 text-zinc-600'
  return (
    <span className={cn('border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest', tone)}>
      {label}
      {seed.note && ` · “${seed.note}”`}
    </span>
  )
}

function GateRowEditor({ gate, seed }: { gate: GateRow; seed?: IntakeGateSeed }) {
  const [manual, setManual] = useState(String(gate.base_price_manual_gbp))
  const [auto, setAuto] = useState(gate.base_price_auto_gbp == null ? '' : String(gate.base_price_auto_gbp))
  const [saved, setSaved] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Which side of the Marius listino applies to this row
  const isComposite = gate.finish === 'composite'
  const seedAuto = seed ? (isComposite ? seed.composite_auto_gbp : seed.victorian_auto_gbp) : null
  const seedManual = seed
    ? isComposite
      ? seed.composite_manual_gbp
      : seed.victorian_manual_gbp
    : null
  const confirmed = seed?.choice === 'confirm'
  const differs =
    confirmed &&
    ((seedManual != null && seedManual !== Number(manual)) ||
      (seedAuto != null && seedAuto !== (auto === '' ? null : Number(auto))))

  function save(nextManual: string, nextAuto: string) {
    setSaved(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', gate.id)
      fd.set('base_price_manual_gbp', nextManual)
      fd.set('base_price_auto_gbp', nextAuto)
      const res = await updateGatePrice(fd)
      setSaved(isAdminActionError(res) ? res.error : 'ok')
    })
  }

  return (
    <tr className="border-t border-zinc-50">
      <td className="px-4 py-2">
        <p className="font-medium text-[#1b1c1a]">{gate.name || humanizeSlug(gate.style)}</p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
          {humanizeSlug(gate.style)} · {formatFinishLabel(gate.finish)}
        </p>
      </td>
      <td className="px-2 py-2 font-mono text-xs text-zinc-500">
        {gate.min_width_mm}×{gate.min_height_mm}
      </td>
      <td className="px-2 py-2">
        <PriceInput value={manual} onChange={setManual} onCommit={() => save(manual, auto)} />
      </td>
      <td className="px-2 py-2">
        <PriceInput
          value={auto}
          placeholder="—"
          onChange={setAuto}
          onCommit={() => save(manual, auto)}
        />
      </td>
      <td className="px-2 py-2 font-mono text-xs">
        {seedManual != null || seedAuto != null ? (
          <span className={cn(differs ? 'text-amber-700' : 'text-zinc-400')}>
            M {seedManual ?? '—'} / A {seedAuto ?? '—'}
          </span>
        ) : (
          <span className="text-zinc-300">—</span>
        )}
      </td>
      <td className="px-4 py-2 text-right">
        {differs && seedManual != null && (
          <button
            type="button"
            disabled={pending}
            className="mr-2 border border-emerald-300 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-emerald-800 disabled:opacity-50"
            onClick={() => {
              const m = String(seedManual)
              const a = seedAuto == null ? '' : String(seedAuto)
              setManual(m)
              setAuto(a)
              save(m, a)
            }}
          >
            Applica intake
          </button>
        )}
        <SaveState pending={pending} saved={saved} />
      </td>
    </tr>
  )
}

// ── Addon ────────────────────────────────────────────────────────────────────

function OptionsTable({ options }: { options: OptionRow[] }) {
  return (
    <div className="mt-4 overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left font-mono text-[9px] uppercase tracking-widest text-zinc-400">
            <th className="px-4 py-2 font-normal">Opzione</th>
            <th className="px-2 py-2 font-normal">Fisso £</th>
            <th className="px-2 py-2 font-normal">Per unità £</th>
            <th className="px-2 py-2 font-normal">Unità</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {options.map((o) => (
            <OptionRowEditor key={o.id} option={o} />
          ))}
        </tbody>
      </table>
      {options.length === 0 && (
        <p className="px-4 py-6 font-mono text-sm text-zinc-400">Nessuna opzione nel DB.</p>
      )}
    </div>
  )
}

function OptionRowEditor({ option }: { option: OptionRow }) {
  const [flat, setFlat] = useState(String(option.flat_price_gbp))
  const [perUnit, setPerUnit] = useState(
    option.per_unit_price_gbp == null ? '' : String(option.per_unit_price_gbp),
  )
  const [saved, setSaved] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setSaved(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', option.id)
      fd.set('flat_price_gbp', flat)
      fd.set('per_unit_price_gbp', perUnit)
      const res = await updateGateOption(fd)
      setSaved(isAdminActionError(res) ? res.error : 'ok')
    })
  }

  return (
    <tr className="border-t border-zinc-50">
      <td className="px-4 py-2">
        <p className="font-medium text-[#1b1c1a]">{option.name || humanizeSlug(option.slug)}</p>
        {option.notes && <p className="text-xs text-zinc-400">{option.notes}</p>}
      </td>
      <td className="px-2 py-2">
        <PriceInput value={flat} onChange={setFlat} onCommit={save} />
      </td>
      <td className="px-2 py-2">
        <PriceInput value={perUnit} placeholder="—" onChange={setPerUnit} onCommit={save} />
      </td>
      <td className="px-2 py-2 font-mono text-xs text-zinc-500">{option.unit_type ?? '—'}</td>
      <td className="px-4 py-2 text-right">
        <SaveState pending={pending} saved={saved} />
      </td>
    </tr>
  )
}

// ── Recinzioni ───────────────────────────────────────────────────────────────

function FencingTable({ fencing }: { fencing: FencingRow[] }) {
  return (
    <div className="mt-4 overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left font-mono text-[9px] uppercase tracking-widest text-zinc-400">
            <th className="px-4 py-2 font-normal">Pannello</th>
            <th className="px-2 py-2 font-normal">Base £</th>
            <th className="px-2 py-2 font-normal">£/m²</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {fencing.map((f) => (
            <FencingRowEditor key={f.id} row={f} />
          ))}
        </tbody>
      </table>
      {fencing.length === 0 && (
        <p className="px-4 py-6 font-mono text-sm text-zinc-400">
          Nessun pannello nel DB — i prezzi fencing sono ancora aperti nell’intake.
        </p>
      )}
    </div>
  )
}

function FencingRowEditor({ row }: { row: FencingRow }) {
  const [base, setBase] = useState(String(row.base_price_gbp))
  const [perM2, setPerM2] = useState(String(row.price_per_m2_gbp))
  const [saved, setSaved] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setSaved(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', row.id)
      fd.set('style', row.style)
      fd.set('finish', row.finish)
      fd.set('base_price_gbp', base)
      fd.set('price_per_m2_gbp', perM2)
      const res = await upsertFencingPanel(fd)
      setSaved(isAdminActionError(res) ? res.error : 'ok')
    })
  }

  return (
    <tr className="border-t border-zinc-50">
      <td className="px-4 py-2">
        <p className="font-medium text-[#1b1c1a]">
          {humanizeSlug(row.style)} · {formatFinishLabel(row.finish)}
        </p>
        {row.notes && <p className="text-xs text-zinc-400">{row.notes}</p>}
      </td>
      <td className="px-2 py-2">
        <PriceInput value={base} onChange={setBase} onCommit={save} />
      </td>
      <td className="px-2 py-2">
        <PriceInput value={perM2} onChange={setPerM2} onCommit={save} />
      </td>
      <td className="px-4 py-2 text-right">
        <SaveState pending={pending} saved={saved} />
      </td>
    </tr>
  )
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function PriceInput({
  value,
  placeholder,
  onChange,
  onCommit,
}: {
  value: string
  placeholder?: string
  onChange: (v: string) => void
  onCommit: () => void
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      step="0.01"
      value={value}
      placeholder={placeholder}
      className="w-24 border-b border-zinc-200 bg-transparent px-1 py-1 font-mono text-sm text-[#1b1c1a] focus:border-[#9e000c] focus:outline-none"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
    />
  )
}

function SaveState({ pending, saved }: { pending: boolean; saved: string | null }) {
  if (pending) {
    return <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">…</span>
  }
  if (saved === 'ok') {
    return (
      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-700">Salvato</span>
    )
  }
  if (saved) {
    return <span className="font-mono text-[9px] uppercase tracking-widest text-[#ba1a1a]">{saved}</span>
  }
  return null
}
