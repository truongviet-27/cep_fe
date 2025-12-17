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
  ['/price-groups', ParameterResourceEnum.RANKS],
])

const getParameterSettingByUrl = (
  route: string,
): ParameterResourceEnum[] | null => {
  switch (route) {
    case '/ranks':
      return [ParameterResourceEnum.RANKS]
    case '/products':
      return [ParameterResourceEnum.PRODUCTS]
    case '/tenant-settings':
      return [ParameterResourceEnum.QUOTATION_FORMS]
    case '/approve-routes':
      return [ParameterResourceEnum.APPROVE_ROUTES]
    case '/price-groups':
      return [ParameterResourceEnum.RANKS, ParameterResourceEnum.PRODUCTS]
    default:
      return null
  }
}

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
  const resources = getParameterSettingByUrl(route)
  if (!resources) return false

  return resources.some(
    (resource) => !parameterSettings?.get?.(resource as ParameterResourceEnum),
  )
}

export const hasForbiddenRoute = (pathName: string) => {
  const { permission } = useUserStore.getState()

  if (
    !permission?.is_module_admin &&
    PermissionRouteFullAdminOnly.has(pathName)
  ) {
    return true
  }

  const pathConverted = pathName.replace(/\/\d+$/, '')

  switch (pathConverted) {
    case '/product-categories/csv':
      return checkForbidden(PermissionEnum.PRODUCT_CATEGORY_EDIT)
    case '/departments/csv':
    case '/departments/create':
    case '/departments/edit':
      return checkForbidden(PermissionEnum.DEPARTMENT_EDIT)
    case '/customers/csv':
    case '/customers/create':
    case '/customers/edit':
      return checkForbidden(PermissionEnum.CUSTOMER_EDIT)
    case '/products':
    case '/products/show':
      return checkForbidden(null, [ParameterResourceEnum.PRODUCTS])
    case '/products/csv':
    case '/products/create':
    case '/products/edit':
      return checkForbidden(PermissionEnum.PRODUCT_EDIT, [
        ParameterResourceEnum.PRODUCTS,
      ])
    case '/product-combos':
    case '/product-combos/show':
      return checkForbidden(null, [ParameterResourceEnum.PRODUCTS])
    case '/product-combos/csv':
    case '/product-combos/create':
    case '/product-combos/edit':
      return checkForbidden(PermissionEnum.PRODUCT_EDIT, [
        ParameterResourceEnum.PRODUCTS,
      ])
    case '/ranks':
    case '/ranks/show':
    case '/ranks/create':
    case '/ranks/edit':
      return checkForbidden(null, [ParameterResourceEnum.RANKS])
    case '/employees/edit':
      return checkForbidden(PermissionEnum.EMPLOYEE_EDIT)
    case '/approve-routes':
    case '/approve-routes/show':
      return checkForbidden(null, [ParameterResourceEnum.APPROVE_ROUTES])
    case '/approve-routes/create':
    case '/approve-routes/edit':
      return checkForbidden(PermissionEnum.APPROVE_ROUTE_EDIT, [
        ParameterResourceEnum.APPROVE_ROUTES,
      ])
    case '/tenant-settings':
      return checkForbidden(null, [ParameterResourceEnum.QUOTATION_FORMS])
    default:
      return false
  }
}

const checkForbidden = (
  permissionEnum: PermissionEnum | null,
  parameters?: ParameterResourceEnum[],
) => {
  const { permission, parameterSettings, hasFullAccessModule } =
    useUserStore.getState()
  let isForbidden = false
  if (!permission?.is_module_admin && permissionEnum) {
    isForbidden = !hasFullAccessModule(permissionEnum)
  }

  if (!isForbidden && parameters?.length) {
    isForbidden = !parameters.every((parameter) =>
      parameterSettings?.get?.(parameter),
    )
  }

  return isForbidden
}
