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
        if (!credentials?.token) {
          console.error('[TokenLogin] No token provided')
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

        let refreshed = null
        try {
          refreshed = await refreshAccessToken({
            accessToken: credentials.token,
            refreshToken: credentials.refreshToken,
            provider: 'TokenLogin',
          })
        } catch (err) {
          console.error('[TokenLogin] Error refreshing tokens:', err)
        }

        return {
          ...introspect,
          access_token: refreshed?.accessToken ?? credentials.token,
          refresh_token: refreshed?.refreshToken ?? credentials.refreshToken,
          expires_at: refreshed?.expiresAt ?? introspect.exp,
        }
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

      // Xử lý cập nhật name từ session.update()
      if (trigger === 'update' && updateSession?.user?.name) {
        token.name = updateSession.user.name
      }

      // Login lần đầu hoặc tạo session mới
      if (account || credsUser) {
        const providerName =
          account?.provider || (credsUser ? 'TokenLogin' : undefined)
        token.accessToken = account?.access_token ?? credsUser.access_token
        token.refreshToken = account?.refresh_token ?? credsUser.refresh_token
        token.expiresAt = account?.expires_at ?? credsUser.expires_at
        token.provider = providerName
        if (user) {
          token.given_name = expandUser?.given_name ?? ''
          token.family_name = expandUser?.family_name ?? ''
          token.name = expandUser?.name ?? token.name
        }
        return token
      }

      // Kiểm tra token còn active hay không (chỉ cho TokenLogin)
      if (token.accessToken) {
        try {
          const introspectRes = await fetch(
            `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token/introspect`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                client_id:
                  token.provider === 'TokenLogin'
                    ? process.env.NEXT_PUBLIC_CLIENT_ID_TENANT_ADMIN!
                    : process.env.NEXT_PUBLIC_CLIENT_ID!,
                client_secret:
                  token.provider === 'TokenLogin'
                    ? process.env.NEXT_PUBLIC_CLIENT_SECRET_TENANT_ADMIN!
                    : process.env.NEXT_PUBLIC_CLIENT_SECRET!,
                token: token.accessToken as string,
              }),
            },
          )

          const introspect = await introspectRes.json()

          // Token bị revoke
          if (!introspectRes.ok || !introspect.active) {
            console.error('[JWT] Token has been revoked')
            return { ...token, error: 'TokenRevoked' }
          }
        } catch (error) {
          console.error('[JWT] Error checking token:', error)
        }
      }

      // Check token expiration
      const willExpireIn =
        (Number(token.expiresAt) ?? 0) - Math.floor(Date.now() / 1000)

      if (willExpireIn > 0) {
        return token
      }

      // Refresh token nếu hết hạn
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      // Token bị revoked → throw error để invalidate session
      if (token.error === 'TokenRevoked') {
        console.error('[Session] Token revoked, invalidating session')
        throw new Error('TokenRevoked')
      }

      if (token) {
        session.user = session.user || {}
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
        session.user.given_name = token.given_name as string
        session.user.family_name = token.family_name as string
        session.user.name = token.name as string
        session.provider = token.provider as string
      }

      return session
    },
  },
}

export default authOptions
