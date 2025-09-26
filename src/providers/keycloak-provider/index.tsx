'use client'

// eslint-disable-next-line simple-import-sort/imports
import { type AuthProvider } from '@refinedev/core'
import { axiosInstance } from '@rest-data-provider/utils'
import { useUserStore } from '@stores/useUserStore'
import { signIn, signOut } from 'next-auth/react'

import { dataProvider } from '@/providers/data-provider'

const authProvider: AuthProvider = {
  login: async () => {
    await signIn('keycloak', {
      callbackUrl: '/',
      redirect: true,
    })

    return { success: true }
  },
  logout: async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    })
    delete axiosInstance.defaults.headers.common['Authorization']
    useUserStore.getState().logout?.()
    return { success: true, redirectTo: '/login' }
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
