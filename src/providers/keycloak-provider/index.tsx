/* eslint-disable */
import type { AuthProvider } from '@refinedev/core'
import { signIn, signOut } from 'next-auth/react'
import { axiosInstance } from '@utility/axios-instance'

const keyCloakProvider = ({ session, to }: { session: any; to: string }) => {
  const { status, data } = session

  const authProvider: AuthProvider = {
    login: async () => {
      signIn('keycloak', {
        callbackUrl: to ? to.toString() : '/',
        redirect: true,
      })

      return {
        success: true,
      }
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: '/login',
      })

      return {
        success: true,
      }
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        }
      }

      return {
        error,
      }
    },
    check: async () => {
      const token = 't'

      if (status === 'unauthenticated' || !token) {
        return {
          authenticated: false,
          redirectTo: '/login',
        }
      }

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return {
        authenticated: true,
      }
    },
    getPermissions: async () => {
      return null
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data
        return {
          name: user.name,
          avatar: user.image,
        }
      }

      return null
    },
  }

  return authProvider
}

export default keyCloakProvider
