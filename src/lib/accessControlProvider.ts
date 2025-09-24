import type { AccessControlProvider } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action }) => {
    const { permission } = useUserStore.getState()

    if (permission?.is_module_admin) {
      return { can: true }
    }

    if (action === 'list' || action === 'show') {
      return { can: true }
    }

    return { can: false }
  },
}
