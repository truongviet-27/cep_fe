import refreshAccessToken from '@utility/refresh-token'
import { NextResponse } from 'next/server'
import type { JWT } from 'next-auth/jwt'

type LogoutRequestBody = {
  accessToken?: string
  refreshToken?: string
  provider?: string
}

export async function POST(req: Request) {
  try {
    let body: LogoutRequestBody = {}
    try {
      body = (await req.json()) as LogoutRequestBody
    } catch {
      // ignore invalid or empty body
    }

    const { accessToken, refreshToken, provider } = body

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'No accessToken or refreshToken provided',
          idToken: null,
        },
        { status: 400 },
      )
    }

    let idToken: string | undefined

    if (refreshToken) {
      try {
        const refreshed = await refreshAccessToken({
          accessToken: accessToken ?? '',
          refreshToken,
          provider,
        } as JWT)

        if (refreshed.idToken && !refreshed.error) {
          idToken = refreshed.idToken
        }
      } catch (e) {
        console.error('Failed to refresh token for logout:', e)
      }
    }

    return NextResponse.json({
      success: true,
      idToken: idToken ?? null,
    })
  } catch (error) {
    console.error('Logout Keycloak error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', idToken: null },
      { status: 500 },
    )
  }
}
