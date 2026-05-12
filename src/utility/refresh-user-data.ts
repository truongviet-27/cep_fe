import type { PermissionType } from '@interfaces/permission'
import type { ParameterResourceEnum } from '@sdk/hey-api'
import useTenantStore from '@stores/useTenantStore'
import { useUserStore } from '@stores/useUserStore'

/**
 * Refresh permissions and parameter settings from API
 * Can be called anywhere to sync latest data from backend
 */
export const refreshUserData = async () => {
  try {
    const { tenantId } = useTenantStore.getState()
    const { setPermission, setParameterSettings, setIsLoggedIn } =
      useUserStore.getState()

    const response = await fetch('/api/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: '',
        tenantId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh user data')
    }

    const { permission, parameterSettings } = await response.json()

    if (!permission || !parameterSettings) {
      throw new Error('Invalid response from /api/me')
    }

    // Update permission
    const permissionResponse = {
      ...permission,
      permissions: new Set(permission.permissions),
    } as PermissionType

    setPermission(permissionResponse)

    // Update parameter settings
    const dataConvert: Map<ParameterResourceEnum, boolean> = new Map()
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
    console.error('Failed to refresh user data:', error)
    throw error
  }
}
