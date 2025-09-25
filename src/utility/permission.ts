import { PermissionEnum } from '@sdk/hey-api'
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
  const { permission, hasFullAccessModule } = useUserStore.getState()

  if (permission?.is_module_admin) {
    return false
  }

  if (PermissionRouteFullAdminOnly.has(pathName)) {
    return true
  }

  const pathConverted = pathName.replace(/\/\d+$/, '')

  switch (pathConverted) {
    case '/product-categories/csv':
      return !hasFullAccessModule(PermissionEnum.PRODUCT_CATEGORY_EDIT)
    case '/departments/csv':
    case '/departments/create':
    case '/departments/edit':
      return !hasFullAccessModule(PermissionEnum.DEPARTMENT_EDIT)
    case '/customers/csv':
    case '/customers/create':
    case '/customers/edit':
      return !hasFullAccessModule(PermissionEnum.CUSTOMER_EDIT)
    case '/products/csv':
    case '/products/create':
    case '/products/edit':
      return !hasFullAccessModule(PermissionEnum.PRODUCT_EDIT)
    case '/employees/edit':
      return !hasFullAccessModule(PermissionEnum.EMPLOYEE_EDIT)
    default:
      return false
  }
}
