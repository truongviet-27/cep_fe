import type { AccessControlProvider } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import { PermissionResourceFullAdminOnly } from '@utility/permission'

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, resource }) => {
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

    return { can: false }
  },
}
