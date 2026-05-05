'use client'

import { useState } from 'react'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import type { Database } from '@/types/database.types'
import { upsertFencingPanel } from './actions'

type Panel = Pick<
  Database['public']['Tables']['fencing_panels']['Row'],
  'id' | 'style' | 'finish' | 'base_price_gbp' | 'price_per_m2_gbp' | 'notes'
>

export function FencingCard({ panel }: { panel: Panel }) {
  const [open, setOpen] = useState(false)
  const [base, setBase] = useState(String(panel.base_price_gbp))
  const [perM2, setPerM2] = useState(String(panel.price_per_m2_gbp))
  const [notes, setNotes] = useState(panel.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const fd = new FormData()
    fd.set('id', panel.id)
    fd.set('style', panel.style)
    fd.set('finish', panel.finish)
    fd.set('base_price_gbp', base)
    fd.set('price_per_m2_gbp', perM2)
    fd.set('notes', notes)

    const res = await upsertFencingPanel(fd)
    if (isAdminActionError(res)) {
      setMsg({ type: 'err', text: res.error })
    } else {
      setMsg({ type: 'ok', text: 'Salvato.' })
      setOpen(false)
    }
    setSaving(false)
  }

  return (
    <div className="border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between px-4 py-4 text-left"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
            {panel.style} · {panel.finish === 'metal' ? 'Metallo' : 'Composito'}
          </p>
          <div className="mt-1 flex gap-4">
            <span className="font-mono text-xs text-zinc-500">
              Base: <span className="font-bold text-[#1b1c1a]">£{panel.base_price_gbp}</span>
            </span>
            <span className="font-mono text-xs text-zinc-500">
              Per m²: <span className="font-bold text-[#1b1c1a]">£{panel.price_per_m2_gbp}</span>
            </span>
          </div>
        </div>
        <span className="ml-4 mt-1 shrink-0 font-mono text-xs text-[#9e000c]">
          {open ? '▲' : '▼'} Modifica
        </span>
      </button>

      {open && (
        <form onSubmit={handleSave} className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
                Prezzo Base (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
                Prezzo per m² (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={perM2}
                onChange={(e) => setPerM2(e.target.value)}
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
              Note (opzionale)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
            />
          </div>

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
