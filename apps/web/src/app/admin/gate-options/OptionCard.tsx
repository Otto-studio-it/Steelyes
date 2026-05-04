'use client'

import { useState } from 'react'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import type { Database } from '@/types/database.types'
import { updateGateOption } from './actions'

type Option = Pick<
  Database['public']['Tables']['gate_options']['Row'],
  'id' | 'name' | 'slug' | 'flat_price_gbp' | 'per_unit_price_gbp' | 'unit_type' | 'notes'
>

export function OptionCard({ option }: { option: Option }) {
  const [open, setOpen] = useState(false)
  const [flat, setFlat] = useState(String(option.flat_price_gbp))
  const [perUnit, setPerUnit] = useState(option.per_unit_price_gbp != null ? String(option.per_unit_price_gbp) : '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const fd = new FormData()
    fd.set('id', option.id)
    fd.set('flat_price_gbp', flat)
    fd.set('per_unit_price_gbp', perUnit)

    const res = await updateGateOption(fd)
    if (isAdminActionError(res)) {
      setMsg({ type: 'err', text: res.error })
    } else {
      setMsg({ type: 'ok', text: 'Salvato.' })
      setOpen(false)
    }
    setSaving(false)
  }

  const tbd = option.per_unit_price_gbp === null && option.unit_type != null

  return (
    <div className="border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between px-4 py-4 text-left"
      >
        <div>
          {tbd && (
            <span className="mb-1 inline-block rounded bg-[#fdd182] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#795916]">
              TBD
            </span>
          )}
          <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
            {option.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <span className="font-mono text-xs text-zinc-500">
              Base: <span className="font-bold text-[#1b1c1a]">£{option.flat_price_gbp}</span>
            </span>
            {option.per_unit_price_gbp != null && (
              <span className="font-mono text-xs text-zinc-500">
                Per {option.unit_type ?? 'unità'}:{' '}
                <span className="font-bold text-[#1b1c1a]">£{option.per_unit_price_gbp}</span>
              </span>
            )}
          </div>
          {option.notes && (
            <p className="mt-1 text-xs text-zinc-400">{option.notes}</p>
          )}
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
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none focus:border-[#9e000c]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]">
                Per {option.unit_type ?? 'unità'} (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={perUnit}
                onChange={(e) => setPerUnit(e.target.value)}
                placeholder="vuoto = non applicabile"
                className="mt-1.5 w-full border-b border-zinc-300 bg-transparent py-1.5 text-sm text-[#1b1c1a] outline-none placeholder:text-zinc-300 focus:border-[#9e000c]"
              />
            </div>
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
