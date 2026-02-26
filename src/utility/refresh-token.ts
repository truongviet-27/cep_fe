import type { JWT } from 'next-auth/jwt'

async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id:
          token.provider === 'TokenLogin'
            ? process.env.NEXT_PUBLIC_CLIENT_ID_TENANT_ADMIN!
            : process.env.NEXT_PUBLIC_CLIENT_ID!,
        client_secret:
          token.provider === 'TokenLogin'
            ? process.env.NEXT_PUBLIC_CLIENT_SECRET_TENANT_ADMIN!
            : process.env.NEXT_PUBLIC_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
      }),
    })

    const refreshedTokens = await res.json()

    if (!res.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      idToken: refreshedTokens.id_token,
      error: undefined,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
export default refreshAccessToken
