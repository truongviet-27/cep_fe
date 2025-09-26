import type { PermissionType } from '@interfaces/permission'
import { dataProvider } from '@providers/data-provider'
import type { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { hasForbiddenRoute } from '@utility/permission'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useBootstrap = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()
  const { setPermission, setParameterSettings } = useUserStore((state) => state)
  const apiUrl = dataProvider.getApiUrl()

  const initSetup = async () => {
    if (pathname === '/login') return

    await getProfile()

    if (hasForbiddenRoute(pathname)) {
      router.push('/403')
    }
  }

  const getProfile = async () => {
    try {
      // if (!permission) return permission
      setIsLoading(true)
      const response = await dataProvider.custom({
        url: `${apiUrl}/me`,
        method: 'get',
      })

      if (!response) return null

      const permissionResponse = {
        ...response.data,
        permissions: new Set(response.data.permissions),
      } as PermissionType

      setPermission(permissionResponse)

      const parameterSettings = await getParameterSettings()

      return {
        permission: permissionResponse,
        parameterSettings,
      }
    } catch (error) {
      console.error(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getParameterSettings = async () => {
    try {
      const { data } = await dataProvider.custom({
        url: `${apiUrl}/parameter-settings`,
        method: 'get',
      })

      const dataConvert: Map<ParameterResourceEnum, boolean> = new Map([])

      data.items.forEach(
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

      return dataConvert
    } catch (e) {
      console.error(e)

      return null
    }
  }

  useEffect(() => {
    initSetup()
  }, [])

  return {
    isLoading,
  }
}
