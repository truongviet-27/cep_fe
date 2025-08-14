'use client'

/* eslint-disable */
import type { AuthProvider } from '@refinedev/core'
import { signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { axiosInstance } from '@rest-data-provider/utils'

const keyCloakProvider = ({ session }: { session: any }) => {
  const { status, data } = session

  const to = usePathname()

  useEffect(() => {
    fetch('/api/get-token')
      .then((res) => res.json())
      .then(
        (data) =>
          (axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${data.token}`),
      )
  }, [])

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
      if (status === 'unauthenticated') {
        return {
          authenticated: false,
          redirectTo: '/login',
        }
      }

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
