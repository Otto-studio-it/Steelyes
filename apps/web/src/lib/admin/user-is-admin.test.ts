import type { User } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import { userIsAdmin } from './user-is-admin'

function user(partial: Partial<User>): User {
  return { id: 'u1', aud: 'authenticated', created_at: '', app_metadata: {}, user_metadata: {}, ...partial } as User
}

describe('userIsAdmin', () => {
  it('accepts app_metadata.is_admin', () => {
    expect(userIsAdmin(user({ app_metadata: { is_admin: true } }))).toBe(true)
  })

  it('ignores user_metadata.is_admin — that field is user-editable', () => {
    expect(userIsAdmin(user({ user_metadata: { is_admin: true } }))).toBe(false)
  })

  it('rejects truthy non-boolean flags and missing users', () => {
    expect(userIsAdmin(user({ app_metadata: { is_admin: 'true' } }))).toBe(false)
    expect(userIsAdmin(null)).toBe(false)
  })
})
