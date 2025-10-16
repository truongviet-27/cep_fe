// eslint-disable-next-line simple-import-sort/imports
import type { PermissionType } from '@interfaces/permission'
import type { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { hasForbiddenRoute } from '@utility/permission'
import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getSessionOnce } from '@lib/get-session-once'
import useTenantStore from '@stores/useTenantStore'
import { isSupperAdmin } from '@utility/decode-token'
import { useEffect, useState } from 'react'

// Fetch and set a tenant for super admin users when no org is present in token
const getTenantForSuperAdmin = async () => {
  try {
    const { tenantId, setTenant } = useTenantStore.getState()
    if (tenantId) return

    const session = await getSessionOnce()
    const accessToken = session?.accessToken
    if (!accessToken) return

    const API_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1'
    const res = await fetch(`${API_URL}/tenants/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) return

    const data = await res.json()
    const firstTenant = data?.data?.items?.[0]
    const fallbackId = firstTenant?.id as string | undefined
    if (fallbackId) {
      const fallbackName = (firstTenant?.name as string) || null
      setTenant(fallbackId, fallbackName)
    }
  } catch (e) {
    console.error('Failed to bootstrap superadmin tenant:', e)
  }
}

export const useBootstrap = () => {
  const session = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    isLoggedIn,
    setPermission,
    setParameterSettings,
    setIsLoggedIn,
    logout,
  } = useUserStore((state) => state)
  const token = searchParams.get('token')
  const refreshToken = searchParams.get('refreshToken')
  const { status } = session

  const validateToken = async () => {
    try {
      if (pathname === '/' && token && refreshToken) {
        if (isLoggedIn) {
          return false
        }

        const res = await signIn('TokenLogin', {
          token,
          refreshToken,
          redirect: false,
          callbackUrl: '/',
        })

        if (!res?.ok) {
          throw res
        }

        return true
      }

      return false
    } catch (error) {
      console.error(error)
      useUserStore.getState().logout?.()
      signOut({
        redirect: true,
        callbackUrl: '/login',
      })
      throw error
    }
  }

  const getProfile = async () => {
    try {
      const { tenantId } = useTenantStore.getState()
      const requestBody = {
        token: '',
        tenantId,
      }
      if (pathname === '/' && token && refreshToken) {
        requestBody.token = token
      }
      const response = await fetch('/api/me', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })
      const { permission, parameterSettings } = await response.json()

      if (!permission || !parameterSettings) {
        throw new Error('Failed to fetch permission')
      }

      console.log('xxxxxxxxxxxxxxxxxxxx')

      const permissionResponse = {
        ...permission,
        permissions: new Set(permission.permissions),
      } as PermissionType
      setPermission(permissionResponse)

      const dataConvert: Map<ParameterResourceEnum, boolean> = new Map([])

      parameterSettings.forEach(
        ({
          is_manage,
          resource,
        }: {
          is_manage: boolean
          resource: ParameterResourceEnum
        }) => {
          dataConvert.set(resource, is_manage)
        },
      )

      setParameterSettings(dataConvert)
      setIsLoggedIn(true)
    } catch (error) {
      console.error(error)
      if (isLoggedIn) {
        logout()
        signOut({
          redirect: true,
          callbackUrl: '/login',
        })
      } else {
        router.push('/login')
      }
      throw error
    }
  }

  const initSetup = async () => {
    try {
      setIsLoading(true)
      if (pathname === '/login') {
        setIsLoading(false)
        return
      }

      await validateToken()
      const sessionOnce = await getSessionOnce()
      const accessToken = sessionOnce?.accessToken
      if (isSupperAdmin(accessToken)) {
        await getTenantForSuperAdmin()
      }
      await getProfile()

      if (hasForbiddenRoute(pathname)) {
        router.push('/403')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initSetup()
  }, [])

  return {
    isLoadingPage: isLoading || status === 'loading',
  }
}
