import type { AuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: `refine-demo`,
      clientSecret: `refine`,
      issuer: `https://lemur-0.cloud-iam.com/auth/realms/refine`,
      // clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      // clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      // issuer: process.env.NEXT_PUBLIC_ISSUER || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image:
            profile.image ??
            'https://faces-img.xcdn.link/thumb-lorem-face-6312_thumb.jpg',
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || '',
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.error = undefined
        return token
      }

      const willExpireIn =
        (Number(token.expiresAt) ?? 0) - Math.floor(Date.now() / 1000)
      if (willExpireIn <= 0) {
        token.error = 'AUTH_EXPIRED'
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = String(token?.accessToken ?? '')
      session.refreshToken = String(token?.refreshToken ?? '')
      session.error = token?.error
      return session
    },
  },
}
export default authOptions
