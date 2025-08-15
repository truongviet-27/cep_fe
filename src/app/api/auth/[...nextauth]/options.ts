import KeycloakProvider from 'next-auth/providers/keycloak'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? ''
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
const issuer = process.env.NEXT_PUBLIC_ISSUER

const authOptions = {
  providers: [
    KeycloakProvider({
      clientId,
      clientSecret,
      issuer,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: `https://faces-img.xcdn.link/thumb-lorem-face-6312_thumb.jpg`,
        }
      },
    }),
  ],
  secret: `UItTuD1HcGXIj8ZfHUswhYdNd40Lc325R8VlxQPUoR0=`,
}

export default authOptions
