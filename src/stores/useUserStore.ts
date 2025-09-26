import type {
  ParameterSettingType,
  PermissionType,
} from '@interfaces/permission'
import type { PermissionEnum } from '@sdk/hey-api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserStore = {
  permission: PermissionType | null
  parameterSettings: ParameterSettingType
  logout?: () => void
  setPermission: (permission: PermissionType) => void
  setParameterSettings: (parameterSettings: ParameterSettingType) => void
  hasFullAccessModule: (permissionName: PermissionEnum) => boolean
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      permission: null,
      parameterSettings: new Map(),
      setPermission: (permission: PermissionType) => set({ permission }),
      setParameterSettings: (parameterSettings: ParameterSettingType) =>
        set({ parameterSettings }),
      logout: () => set({ permission: null }),
      hasFullAccessModule: (permissionName: PermissionEnum) => {
        const permission = get().permission

        if (permission?.is_module_admin) return true

        return !!permission?.permissions.has?.(permissionName)
      },
    }),
    {
      name: 'profile',
    },
  ),
)
