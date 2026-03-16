import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Cache to avoid checking too many times
const tokenCheckCache = new Map<
  string,
  { isValid: boolean; timestamp: number }
>()
const CACHE_DURATION = 30 * 1000 // Cache for 30 seconds

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Allow access to public pages
  if (
    pathname === '/login' ||
    pathname === '/auth-revoked' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // If there is token and refreshToken in query params (TokenLogin flow), allow
  const tokenParam = searchParams.get('token')
  const refreshTokenParam = searchParams.get('refreshToken')
  if (tokenParam && refreshTokenParam) {
    console.log('TokenLogin flow detected, allowing request')
    return NextResponse.next()
  }

  // Get token from cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If there is no token, redirect to login
  if (!token) {
    const url = new URL('/login', req.url)
    return NextResponse.redirect(url)
  }

  // Only check token for TokenLogin provider
  if (token.provider === 'TokenLogin' && token.accessToken) {
    const accessToken = token.accessToken as string
    const now = Date.now()

    // Check cache before
    const cached = tokenCheckCache.get(accessToken)
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      if (!cached.isValid) {
        console.error('Token is invalid (from cache), redirecting to login')
        const response = NextResponse.redirect(
          new URL('/auth-revoked', req.url),
        )
        response.cookies.delete('next-auth.session-token')
        response.cookies.delete('__Secure-next-auth.session-token')
        response.cookies.delete('next-auth.csrf-token')
        response.cookies.delete('__Secure-next-auth.csrf-token')
        response.cookies.delete('next-auth.callback-url')
        response.cookies.delete('__Secure-next-auth.callback-url')
        return response
      }
      return NextResponse.next()
    }

    try {
      // Check if token is still active
      const introspectRes = await fetch(
        `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token/introspect`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID_TENANT_ADMIN!,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET_TENANT_ADMIN!,
            token: accessToken,
          }),
        },
      )

      const introspect = await introspectRes.json()
      const isValid = introspectRes.ok && introspect.active

      // Save to cache
      tokenCheckCache.set(accessToken, { isValid, timestamp: now })

      // If token is not active, redirect to clear session page
      if (!isValid) {
        console.error('Token has been revoked, redirecting to clear session')

        // Delete cookies and redirect to special page to clear session data
        const response = NextResponse.redirect(
          new URL('/auth-revoked', req.url),
        )
        response.cookies.delete('next-auth.session-token')
        response.cookies.delete('__Secure-next-auth.session-token')
        response.cookies.delete('next-auth.csrf-token')
        response.cookies.delete('__Secure-next-auth.csrf-token')
        response.cookies.delete('next-auth.callback-url')
        response.cookies.delete('__Secure-next-auth.callback-url')
        return response
      }
    } catch (error) {
      console.error('Error checking token status in middleware:', error)
      // If there is an error when checking, allow request to continue
      // but do not cache the result
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
