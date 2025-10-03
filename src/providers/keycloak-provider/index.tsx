'use client'

// eslint-disable-next-line simple-import-sort/imports
import { type AuthProvider } from '@refinedev/core'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import { useUserStore } from '@stores/useUserStore'
import { signIn, signOut } from 'next-auth/react'

import { dataProvider } from '@/providers/data-provider'
import { getSessionOnce } from '@/lib/get-session-once'

const authProvider: AuthProvider = {
  login: async () => {
    await signIn('keycloak', {
      callbackUrl: '/',
      redirect: true,
    })

    return { success: true }
  },
  logout: async () => {
    const clearSessionData = () => {
      delete axiosInstance.defaults.headers.common['Authorization']
      useUserStore.getState().logout?.()
    }

    try {
      const sessionData = await getSessionOnce()

      if (sessionData?.idToken) {
        const keycloakUrl = process.env.NEXT_PUBLIC_ISSUER || ''
        const endSessionEndpoint = `${keycloakUrl}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}&id_token_hint=${sessionData.idToken}`

        await signOut({ redirect: false })
        clearSessionData()

        window.location.href = endSessionEndpoint
      } else {
        await signOut({ redirect: true, callbackUrl: '/login' })
        clearSessionData()
      }

      return { success: true, redirectTo: '/login' }
    } catch (error) {
      console.error('Logout error:', error)

      try {
        await signOut({ redirect: false })
        clearSessionData()

        if (typeof window !== 'undefined') {
          window.sessionStorage.clear()
          window.localStorage.clear()
          window.location.href = '/login'
        }
      } catch (fallbackError) {
        console.error('Fallback logout error:', fallbackError)
      }

      return {
        success: false,
        error: new Error('Failed to logout completely'),
      }
    }
  },
  onError: async (error) => {
    if (error?.response?.status === 401) {
      return { logout: true }
    }

    if (error?.response?.status === 403) {
      return { redirectTo: '/403' }
    }

    return { error }
  },
  check: async () => {
    return { authenticated: true }
  },
  getPermissions: async () => {
    return null
  },
  getIdentity: async () => {
    try {
      const { data } = await dataProvider.custom({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
        method: 'get',
      })

      return data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return null
    }
  },
}

export default authProvider
