// eslint-disable-next-line simple-import-sort/imports
import type { PermissionType } from '@interfaces/permission'
import { getSessionOnce } from '@lib/get-session-once'
import type { ParameterResourceEnum } from '@sdk/hey-api'
import useTenantStore from '@stores/useTenantStore'
import { useUserStore } from '@stores/useUserStore'
import { isSupperAdmin, getUserIdFromToken } from '@utility/decode-token'
import { hasForbiddenRoute } from '@utility/permission'
import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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
  const { status, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    setPermission,
    setParameterSettings,
    setIsLoggedIn,
    logout,
    permission,
  } = useUserStore((state) => state)
  const isLoggedIn = useUserStore.getState().isLoggedIn
  const token = searchParams.get('token')
  const refreshToken = searchParams.get('refreshToken')
  // check if session name has been updated
  const hasUpdatedSessionRef = useRef(false)

  const validateToken = async () => {
    try {
      console.log('pathname: ', pathname)
      console.log('token: ', token)
      console.log('refreshToken: ', refreshToken)

      if (pathname === '/' && token) {
        const currentSession = await getSessionOnce()
        const currentUserId = getUserIdFromToken(currentSession?.accessToken)
        const newUserId = getUserIdFromToken(token)

        // Check if same user and already logged in with valid session
        if (
          isLoggedIn &&
          currentUserId === newUserId &&
          currentSession?.accessToken &&
          !currentSession?.error
        ) {
          console.log('[Controller] Same user already logged in, skipping')
          return false
        }

        // Different user or expired session - need to sign out first
        if (currentSession?.accessToken) {
          console.log('[Controller] Signing out old session before TokenLogin')
          if (currentUserId && newUserId && currentUserId !== newUserId) {
            console.log('[Controller] Different user detected')
            useUserStore.getState().logout?.()
            useTenantStore.getState().clearTenant()
          }
          await signOut({
            redirect: false,
          })
        }

        console.log('[Controller] Starting TokenLogin')
        const res = await signIn('TokenLogin', {
          token,
          refreshToken,
          redirect: false,
          callbackUrl: '/',
        })

        if (!res?.ok) {
          throw res
        }

        console.log('[Controller] TokenLogin successful')
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

  const getProfile = async (isTokenValid: boolean) => {
    try {
      const { tenantId } = useTenantStore.getState()
      const requestBody = {
        token: '',
        tenantId,
      }
      if (pathname === '/' && token && isTokenValid) {
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

      // Lưu permission để sử dụng trong useEffect sau

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
      if (permission?.is_first_login) {
        router.replace('/initial-setup-guide')
        return
      }
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

      const isTokenValid = await validateToken()
      const sessionOnce = await getSessionOnce()
      const accessToken = sessionOnce?.accessToken

      if (isSupperAdmin(accessToken)) {
        await getTenantForSuperAdmin()
      }
      await getProfile(isTokenValid)

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

  useEffect(() => {
    const updateSessionName = async () => {
      // if session is not authenticated or permission is not set or updateSession is not available or session name has been updated, return
      if (
        status !== 'authenticated' ||
        !permission?.user?.name ||
        !updateSession ||
        hasUpdatedSessionRef.current
      ) {
        return
      }

      try {
        const currentSession = await getSessionOnce()
        const apiUserName = permission.user.name
        const sessionUserName = currentSession?.user?.name

        if (apiUserName && apiUserName !== sessionUserName) {
          console.log('Calling updateSession with:', { name: apiUserName })
          await updateSession({
            user: {
              ...currentSession?.user,
              name: apiUserName,
            },
          })
          hasUpdatedSessionRef.current = true
          console.log('updateSession called successfully')
        } else {
          hasUpdatedSessionRef.current = true
        }
      } catch (error) {
        console.error('Error updating session name:', error)
      }
    }

    updateSessionName()
  }, [status, permission?.user?.name, updateSession])

  return {
    isLoadingPage: isLoading || status === 'loading',
  }
}
