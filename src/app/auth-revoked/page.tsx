'use client'

import LoadingPage from '@components/common/loading-page'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import useTenantStore from '@stores/useTenantStore'
import { useUserStore } from '@stores/useUserStore'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function TokenRevokedPage() {
  const router = useRouter()

  useEffect(() => {
    const clearAndRedirect = async () => {
      try {
        // Clear session data
        delete axiosInstance.defaults.headers.common['Authorization']
        useUserStore.getState().logout?.()
        useTenantStore.getState().clearTenant()

        // Clear NextAuth session
        await signOut({ redirect: false })

        // Clear storage
        if (typeof window !== 'undefined') {
          window.sessionStorage.clear()
          window.localStorage.clear()
        }

        // Redirect to login
        router.push('/login')
      } catch (error) {
        console.error('Error clearing session:', error)
        // Force redirect anyway
        router.push('/login')
      }
    }

    clearAndRedirect()
  }, [router])

  return <LoadingPage />
}
