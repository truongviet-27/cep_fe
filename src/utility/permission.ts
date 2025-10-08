import { ParameterResourceEnum, PermissionEnum } from '@sdk/hey-api'
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

export const PARAMETER_SETTINGS = new Set(Object.values(ParameterResourceEnum))

export const PARAMETER_SETTING_EXCLUDE: Set<string> = new Set([
  ParameterResourceEnum.CUSTOMERS,
  ParameterResourceEnum.PRODUCT_CATEGORIES,
  ParameterResourceEnum.PRODUCT_UNITS,
  ParameterResourceEnum.QUOTATION_TEMPLATES,
  ParameterResourceEnum.MAIL_TEMPLATES,
  ParameterResourceEnum.CODE_ISSUE_SETTINGS,
])

export const PARAMETER_SETTING_URL = new Map<string, ParameterResourceEnum>([
  ['/ranks', ParameterResourceEnum.RANKS],
  ['/products', ParameterResourceEnum.PRODUCTS],
  ['/tenant-settings', ParameterResourceEnum.QUOTATION_FORMS],
  ['/approve-routes', ParameterResourceEnum.APPROVE_ROUTES],
])

export const hasDisableMenu = (route?: string): boolean => {
  const { permission } = useUserStore.getState()

  if (permission?.is_module_admin) {
    return false
  }

  return !!(route && PermissionRouteFullAdminOnly.has(route))
}

export const hasDisableMenuByParameter = (route?: string): boolean => {
  const { parameterSettings } = useUserStore.getState()

  if (!route) {
    return false
  }
  const resource = PARAMETER_SETTING_URL.get(route)

  if (!resource) return false

  return !parameterSettings?.get?.(resource)
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
    case '/approve-routes/create':
    case '/approve-routes/edit':
      return !hasFullAccessModule(PermissionEnum.APPROVE_ROUTE_EDIT)
    default:
      return false
  }
}
