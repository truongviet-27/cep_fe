'use client'

import type { AuthProvider } from '@refinedev/core'
import { axiosInstance } from '@rest-data-provider/utils'
import { signIn, signOut } from 'next-auth/react'

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
    return { success: true, redirectTo: '/login' }
  },
  onError: async (error) => {
    if (error?.response?.status === 401) {
      return { logout: true }
    }

    if (error?.response?.status === 403) {
      return { success: false, redirectTo: '/not-found' }
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
    // const res = await fetch('/api/get-user')
    // if (res.status === 200) {
    //   const user = await res.json()
    //   return {
    //     name: user.name,
    //     avatar: user.image,
    //   }
    // }
    return null
  },
}

export default authProvider
