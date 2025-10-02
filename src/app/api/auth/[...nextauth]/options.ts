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
        if (!credentials?.token) return null

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ACC_ADMIN_CONSOLE}/realms/dev/protocol/openid-connect/token/introspect`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID || '',
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
                token: credentials.token,
              }),
            },
          )

          const data = await res.json()

          if (res.ok && data && data?.active) {
            return {
              ...data,
              access_token: credentials.token,
              refresh_token: credentials.refreshToken,
              expires_at: data?.exp,
              id_token: credentials.token,
            }
          }
          return null
        } catch (error) {
          console.error('Validate error', error)

          return null
        }
      },
    }),
  ],
  secret: `UItTuD1HcGXIj8ZfHUswhYdNd40Lc325R8VlxQPUoR0=`,
  callbacks: {
    async jwt({ token, account, user }) {
      const credsUser = user as CredentialsUser
      if (account || credsUser) {
        // token.idToken = account?.id_token ?? credsUser.id_token
        token.accessToken = account?.access_token ?? credsUser.access_token
        // token.refreshToken = account?.refresh_token ?? credsUser.refresh_token
        token.expiresAt = account?.expires_at ?? credsUser.expires_at
        // token.error = undefined
        return token
      }

      const willExpireIn =
        (Number(token.expiresAt) ?? 0) - Math.floor(Date.now() / 1000)
      if (willExpireIn > 0) {
        return token
      }

      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      if (token) {
        session.user = session.user || {}
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.idToken = token.idToken as string
        session.expiresAt = token.expiresAt as number
      }

      return session
    },
  },
}

export default authOptions
