import type {
  AccessControlProvider,
  CanParams,
  CanReturnType,
} from '@refinedev/core'
import { PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { PermissionResourceFullAdminOnly } from '@utility/permission'

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, resource }: CanParams): Promise<CanReturnType> => {
    const { permission } = useUserStore.getState()

    if (permission?.is_module_admin) {
      return { can: true }
    }

    if (resource && PermissionResourceFullAdminOnly.has(resource)) {
      return { can: false }
    }

    if (action === 'list' || action === 'show') {
      return { can: true }
    }

    switch (resource) {
      case 'product-units':
        return {
          can: !!permission?.permissions?.has?.(
            PermissionEnum.PRODUCT_UNIT_EDIT,
          ),
        }
      default:
        return { can: false }
    }
  },
}
