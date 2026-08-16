import { userIsAdmin } from '@/lib/admin/user-is-admin'
import {
  SITE_HOLD_COOKIE,
  SITE_HOLD_QUERY,
  SITE_HOLD_RETRY_AFTER_SECONDS,
  getSiteHoldBypassToken,
  isSiteHoldEnabled,
} from '@/lib/site-hold'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const HOLD_HEADERS = {
  'Retry-After': String(SITE_HOLD_RETRY_AFTER_SECONDS),
  'Cache-Control': 'no-store, must-revalidate',
} as const

function isHoldExemptPath(pathname: string): boolean {
  if (pathname === '/hold' || pathname.startsWith('/hold/')) return true
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.ico' || pathname === '/icon' || pathname === '/apple-icon') return true
  return false
}

function applyHoldBypass(request: NextRequest): NextResponse | null {
  const token = getSiteHoldBypassToken()
  if (!token) return null

  const value = request.nextUrl.searchParams.get(SITE_HOLD_QUERY)
  if (value === null) return null

  const url = request.nextUrl.clone()
  url.searchParams.delete(SITE_HOLD_QUERY)

  const response = NextResponse.redirect(url)
  if (value === token) {
    response.cookies.set(SITE_HOLD_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  } else {
    response.cookies.set(SITE_HOLD_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
  }
  return response
}

function handleSiteHold(request: NextRequest): NextResponse | null {
  if (!isSiteHoldEnabled()) return null

  const bypassRedirect = applyHoldBypass(request)
  if (bypassRedirect) return bypassRedirect

  const { pathname } = request.nextUrl
  if (isHoldExemptPath(pathname)) return null

  const token = getSiteHoldBypassToken()
  if (token && request.cookies.get(SITE_HOLD_COOKIE)?.value === token) return null

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503, headers: HOLD_HEADERS }
    )
  }

  const holdUrl = request.nextUrl.clone()
  holdUrl.pathname = '/hold'
  holdUrl.search = ''
  return NextResponse.rewrite(holdUrl, { status: 503, headers: HOLD_HEADERS })
}

export async function middleware(request: NextRequest) {
  const hold = handleSiteHold(request)
  if (hold) return hold

  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) return NextResponse.next()

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!userIsAdmin(user)) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets under /_next/static and common image extensions.
     * Site hold + admin auth both run here; non-admin paths exit early after hold check.
     */
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
