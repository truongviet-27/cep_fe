import type {
  ParameterSettingType,
  PermissionType,
} from '@interfaces/permission'
import type { PermissionEnum } from '@sdk/hey-api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserStore = {
  isLoggedIn: boolean
  permission: PermissionType | null
  organizationName: string | null
  parameterSettings: ParameterSettingType
  logout: () => void
  setPermission: (permission: PermissionType) => void
  setOrganizationName: (name: string | null) => void
  setParameterSettings: (parameterSettings: ParameterSettingType) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
  hasFullAccessModule: (permissionName: PermissionEnum) => boolean
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      permission: null,
      parameterSettings: new Map(),
      organizationName: null,
      setPermission: (permission: PermissionType) =>
        set({
          permission,
          organizationName: permission?.organization_name ?? null,
        }),
      setOrganizationName: (name) => set({ organizationName: name }),
      setParameterSettings: (parameterSettings: ParameterSettingType) =>
        set({ parameterSettings }),
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      logout: () =>
        set({
          permission: null,
          isLoggedIn: false,
          parameterSettings: new Map(),
          organizationName: null,
        }),
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
