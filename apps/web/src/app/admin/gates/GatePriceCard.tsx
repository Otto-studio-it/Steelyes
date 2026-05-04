'use client'

import { useState } from 'react'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import type { Database } from '@/types/database.types'
import { updateGatePrice } from './actions'

type Gate = Pick<
  Database['public']['Tables']['gates']['Row'],
  | 'id'
  | 'name'
  | 'type'
  | 'style'
  | 'finish'
  | 'min_width_mm'
  | 'min_height_mm'
  | 'base_price_manual_gbp'
  | 'base_price_auto_gbp'
>

export function GatePriceCard({ gate }: { gate: Gate }) {
  const [open, setOpen] = useState(false)
  const [manual, setManual] = useState(String(gate.base_price_manual_gbp))
  const [auto, setAuto] = useState(gate.base_price_auto_gbp != null ? String(gate.base_price_auto_gbp) : '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const fd = new FormData()
    fd.set('id', gate.id)
    fd.set('base_price_manual_gbp', manual)
    fd.set('base_price_auto_gbp', auto)

    const res = await updateGatePrice(fd)

    if (isAdminActionError(res)) {
      setMsg({ type: 'err', text: res.error })
    } else {
      setMsg({ type: 'ok', text: 'Salvato.' })
      setOpen(false)
    }
    setSaving(false)
  }

  const finishLabel = gate.finish === 'metal' ? 'Metallo' : 'Composito'

  return (
    <div className="border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between px-4 py-4 text-left"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
            {gate.style} · {finishLabel}
          </p>
          <p className="mt-0.5 font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
            {gate.name ?? `${gate.type} — ${finishLabel}`}
          </p>
          <div className="mt-1.5 flex gap-4">
            <span className="font-mono text-xs text-zinc-500">
              Manuale: <span className="font-bold text-[#1b1c1a]">£{gate.base_price_manual_gbp}</span>
            </span>
            {gate.base_price_auto_gbp != null && (
              <span className="font-mono text-xs text-zinc-500">
                Auto: <span className="font-bold text-[#1b1c1a]">£{gate.base_price_auto_gbp}</span>
              </span>
            )}
          </div>
        </div>
        <span className="ml-4 mt-1 font-mono text-xs text-[#9e000c]">{open ? '▲' : '▼'} Modifica</span>
      </button>

      {open && (
        <form onSubmit={handleSave} className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
                Prezzo Manuale (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
                Prezzo Automatico (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={auto}
                onChange={(e) => setAuto(e.target.value)}
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
              />
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] text-zinc-400">
            Dim. min: {gate.min_width_mm}mm L × {gate.min_height_mm}mm H
          </p>

          {msg && (
            <p className={`mt-2 font-mono text-xs ${msg.type === 'ok' ? 'text-green-700' : 'text-[#ba1a1a]'}`}>
              {msg.text}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[40px] items-center bg-[#9e000c] px-5 font-heading text-xs font-bold uppercase tracking-tight text-white disabled:opacity-60"
            >
              {saving ? 'Salvataggio...' : 'Salva'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setMsg(null) }}
              className="inline-flex min-h-[40px] items-center border border-zinc-200 px-4 font-heading text-xs font-bold uppercase tracking-tight text-zinc-600"
            >
              Annulla
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
