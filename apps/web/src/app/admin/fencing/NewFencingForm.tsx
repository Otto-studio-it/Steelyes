'use client'

import { useState } from 'react'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import { upsertFencingPanel } from './actions'

const STYLES = ['modern', 'classic', 'privacy', 'victorian'] as const
const FINISHES = ['metal', 'composite'] as const

export function NewFencingForm() {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<string>('victorian')
  const [finish, setFinish] = useState<string>('metal')
  const [base, setBase] = useState('')
  const [perM2, setPerM2] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const fd = new FormData()
    fd.set('style', style)
    fd.set('finish', finish)
    fd.set('base_price_gbp', base)
    fd.set('price_per_m2_gbp', perM2)
    fd.set('notes', notes)

    const res = await upsertFencingPanel(fd)
    if (isAdminActionError(res)) {
      setMsg({ type: 'err', text: res.error })
    } else {
      setMsg({ type: 'ok', text: 'Pannello aggiunto.' })
      setOpen(false)
      setBase('')
      setPerM2('')
      setNotes('')
    }
    setSaving(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center border-2 border-[#9e000c] px-5 font-heading text-sm font-bold uppercase tracking-tight text-[#9e000c] transition-colors hover:bg-[#9e000c] hover:text-white"
      >
        + Aggiungi Pannello
      </button>
    )
  }

  return (
    <div className="border border-zinc-200 bg-white px-4 pb-4 pt-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">Nuovo Pannello</p>
      <form onSubmit={handleSave} className="mt-3 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">Stile</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
            >
              {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">Finitura</label>
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
            >
              {FINISHES.map((f) => <option key={f} value={f}>{f === 'metal' ? 'Metallo' : 'Composito'}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">Prezzo Base (£)</label>
            <input
              type="number" step="0.01" min="0" required
              value={base} onChange={(e) => setBase(e.target.value)}
              className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">Per m² (£)</label>
            <input
              type="number" step="0.01" min="0" required
              value={perM2} onChange={(e) => setPerM2(e.target.value)}
              className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
            />
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">Note (opzionale)</label>
          <input
            type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
          />
        </div>

        {msg && (
          <p className={`font-mono text-xs ${msg.type === 'ok' ? 'text-green-700' : 'text-[#ba1a1a]'}`}>
            {msg.text}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit" disabled={saving}
            className="inline-flex min-h-[40px] items-center bg-[#9e000c] px-5 font-heading text-xs font-bold uppercase tracking-tight text-white disabled:opacity-60"
          >
            {saving ? 'Salvataggio...' : 'Aggiungi'}
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
    </div>
  )
}
