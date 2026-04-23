import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Missing Supabase anon key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Missing Supabase service role key'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL').optional(),
})

export const env = envSchema.parse(process.env)
