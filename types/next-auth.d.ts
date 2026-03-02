import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    expiresAt?: number
    provider?: string
    error?: string
    tenant?: {
      id: string
      name: string
    }
    user?: {
      given_name?: string
      family_name?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    expiresAt?: number
    error?: string
    provider?: string
    name?: string
    given_name?: string
    family_name?: string
  }
}
