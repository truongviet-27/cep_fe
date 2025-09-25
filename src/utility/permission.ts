import { useUserStore } from '@stores/useUserStore'

export const PermissionResourceFullAdminOnly = new Set([
  'parameter-settings',
  'permission-settings',
  'tenant-settings',
  'tags',
])

export const PermissionRouteFullAdminOnly = new Set([
  '/parameter-settings', // ST00
  '/permission-settings', // ST01
  '/tenant-settings', // ST06
  '/tags', // ST05
])

export const hasDisableMenu = (route?: string): boolean => {
  const { permission } = useUserStore.getState()

  if (permission?.is_module_admin) {
    return false
  }

  return !!(route && PermissionRouteFullAdminOnly.has(route))
}

export const hasForbiddenRoute = (pathName: string) => {
  const { permission } = useUserStore.getState()

  if (permission?.is_module_admin) {
    return false
  }

  if (PermissionRouteFullAdminOnly.has(pathName)) {
    return true
  }

  return true
}
