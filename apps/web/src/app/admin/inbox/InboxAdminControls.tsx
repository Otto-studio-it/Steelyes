'use client'

import { useTransition } from 'react'

import { markInboxEmailHandled } from '@/app/admin/inbox/actions'

type InboxAdminControlsProps = {
  emailId: string
  handled: boolean
}

export function InboxAdminControls({ emailId, handled }: InboxAdminControlsProps) {
  const [pending, startTransition] = useTransition()

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await markInboxEmailHandled(formData)
        })
      }}
    >
      <input type="hidden" name="id" value={emailId} />
      <input type="hidden" name="handled" value={(!handled).toString()} />
      <button
        type="submit"
        disabled={pending}
        className="font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-2 hover:underline disabled:opacity-60"
      >
        {pending ? 'Salvo…' : handled ? 'Segna da rivedere' : 'Segna gestita'}
      </button>
    </form>
  )
}
