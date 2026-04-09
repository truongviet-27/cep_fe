import refreshAccessToken from '@utility/refresh-token'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import KeycloakProvider from 'next-auth/providers/keycloak'

type CredentialsUser = {
  id_token?: string
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
      issuer: process.env.NEXT_PUBLIC_ISSUER || '',
      authorization: { params: { scope: 'openid profile email organization' } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          given_name: profile?.given_name ?? '',
          family_name: profile?.family_name ?? '',
          email: profile.email,
          image: `https://faces-img.xcdn.link/thumb-lorem-face-6312_thumb.jpg`,
        }
      },
    }),
    CredentialsProvider({
      id: 'TokenLogin',
      name: 'TokenLogin',
      credentials: {
        token: { label: 'Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
      },
      async authorize(credentials) {
        console.log('[TokenLogin] Starting authorization')

        if (!credentials?.token || !credentials?.refreshToken) {
          console.error('[TokenLogin] Missing token or refreshToken')
          return null
        }

        const introspectRes = await fetch(
          `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token/introspect`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.NEXT_PUBLIC_CLIENT_ID_TENANT_ADMIN!,
              client_secret:
                process.env.NEXT_PUBLIC_CLIENT_SECRET_TENANT_ADMIN!,
              token: credentials.token,
            }),
          },
        )

        const introspect = await introspectRes.json()

        if (!introspectRes.ok || !introspect.active) {
          console.error('[TokenLogin] Token invalid or expired')
          return null
        }

        const result = {
          ...introspect,
          access_token: credentials.token,
          refresh_token: credentials.refreshToken,
          expires_at: introspect.exp,
        }

        console.log(
          '[TokenLogin] Authorization successful, expires at:',
          new Date(introspect.exp * 1000).toISOString(),
        )
        return result
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user, trigger, session: updateSession }) {
      const expandUser = user as
        | { given_name?: string; family_name?: string; name?: string }
        | undefined
      const credsUser = user as CredentialsUser

      if (trigger === 'update' && updateSession?.user?.name) {
        token.name = updateSession.user.name
      }

      if (account || credsUser) {
        const provider = account?.provider || 'TokenLogin'
        console.log(
          '[JWT Callback] New login, provider:',
          provider,
          'expires at:',
          new Date(
            (account?.expires_at ?? credsUser.expires_at ?? 0) * 1000,
          ).toISOString(),
        )

        token.accessToken = account?.access_token ?? credsUser.access_token
        token.refreshToken = account?.refresh_token ?? credsUser.refresh_token
        token.expiresAt = account?.expires_at ?? credsUser.expires_at
        token.provider = account?.provider ?? undefined
        if (user) {
          token.given_name = expandUser?.given_name ?? ''
          token.family_name = expandUser?.family_name ?? ''
          token.name = expandUser?.name ?? token.name
        }
        return token
      }

      const currentTime = Math.floor(Date.now() / 1000)
      const willExpireIn = (Number(token.expiresAt) ?? 0) - currentTime

      // If token already has error, don't attempt refresh again
      if (token.error) {
        console.log('[JWT Callback] Token has error, skipping refresh')
        return token
      }

      if (willExpireIn > 0) {
        return token
      }

      console.log('[JWT Callback] Token expired, attempting refresh...')
      const refreshedToken = await refreshAccessToken(token)

      if (refreshedToken.error) {
        console.error('[JWT Callback] Refresh failed:', refreshedToken.error)
        return { ...token, error: 'RefreshAccessTokenError' }
      }

      console.log(
        '[JWT Callback] Token refreshed successfully, expires at:',
        new Date((Number(refreshedToken.expiresAt) ?? 0) * 1000).toISOString(),
      )
      return refreshedToken
    },

    async session({ session, token }) {
      if (token) {
        session.user = session.user || {}
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
        session.user.given_name = token.given_name as string
        session.user.family_name = token.family_name as string
        session.user.name = token.name as string
        session.provider = token.provider as string
        session.error = token.error as string | undefined

        if (session.error) {
          console.error('[Session Callback] Session has error:', session.error)
        }
      }

      return session
    },
  },
}

export default authOptions
