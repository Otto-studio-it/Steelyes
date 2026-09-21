import { z } from 'zod'

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Missing Supabase anon key'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL').optional(),
})

const serverSchema = clientSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Missing Supabase service role key').optional(),
  // Optional so saving a configuration does not crash if mail is misconfigured.
  RESEND_API_KEY: z.string().optional(),
})

type ServerEnv = z.infer<typeof serverSchema>

function parseEnv(): ServerEnv {
  const clientVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }

  if (typeof window === 'undefined') {
    // During build (CI=true), runtime secrets are not available and not needed
    // They will be injected at container runtime by Coolify
    const isBuild = process.env.CI === 'true' || process.env.NODE_ENV === 'production'
    
    return serverSchema.parse({
      ...clientVars,
      SUPABASE_SERVICE_ROLE_KEY: isBuild ? undefined : process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    })
  }

  return clientSchema.parse(clientVars) as ServerEnv
}

export const env: ServerEnv = parseEnv()
