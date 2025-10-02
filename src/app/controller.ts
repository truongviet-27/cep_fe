// eslint-disable-next-line simple-import-sort/imports
import type { PermissionType } from '@interfaces/permission'
import type { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { hasForbiddenRoute } from '@utility/permission'
import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useBootstrap = () => {
  const session = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      setIsLoading(true)
      const requestBody = {
        token: '',
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
    } finally {
      setIsLoading(false)
    }
  }

  const initSetup = async () => {
    try {
      if (pathname === '/login') return

      await validateToken()
      await getProfile()

      if (hasForbiddenRoute(pathname)) {
        router.push('/403')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    initSetup()
  }, [])

  return {
    isLoadingPage: isLoading || status === 'loading',
  }
}
