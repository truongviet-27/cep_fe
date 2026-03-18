import type { JWT } from 'next-auth/jwt'

async function refreshAccessToken(token: JWT) {
  console.log('[Refresh Token] Starting refresh, provider:', token.provider)

  try {
    const url = `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token`

    const clientId =
      token.provider === 'TokenLogin'
        ? process.env.NEXT_PUBLIC_CLIENT_ID_TENANT_ADMIN!
        : process.env.NEXT_PUBLIC_CLIENT_ID!

    const clientSecret =
      token.provider === 'TokenLogin'
        ? process.env.NEXT_PUBLIC_CLIENT_SECRET_TENANT_ADMIN!
        : process.env.NEXT_PUBLIC_CLIENT_SECRET!

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
      }),
    })

    const refreshedTokens = await res.json()

    if (!res.ok) {
      console.error(
        '[Refresh Token] Keycloak error:',
        refreshedTokens.error,
        refreshedTokens.error_description,
      )
      throw refreshedTokens
    }

    const newExpiresAt =
      Math.floor(Date.now() / 1000) + refreshedTokens.expires_in

    console.log(
      '[Refresh Token] Success, new expires at:',
      new Date(newExpiresAt * 1000).toISOString(),
    )

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: newExpiresAt,
      idToken: refreshedTokens.id_token,
      error: undefined,
    }
  } catch (error) {
    console.error('[Refresh Token] Failed:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
export default refreshAccessToken
