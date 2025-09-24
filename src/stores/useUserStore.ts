import type { PermissionType } from '@interfaces/permission'
import { dataProvider } from '@providers/data-provider'
import { create } from 'zustand'

type UserStore = {
  isFetching: boolean
  permission: PermissionType | null
  setPermission: (permission: PermissionType) => void
  setIsFetching: (isFetching: boolean) => void
  logout?: () => void
  useSyncUser: () => Promise<boolean>
}

export const useUserStore = create<UserStore>((set, get) => ({
  isFetching: false,
  permission: null,
  setIsFetching: (isFetching: boolean) => set({ isFetching }),
  setPermission: (permission: PermissionType) => set({ permission }),
  logout: () => set({ permission: null }),
  useSyncUser: async () => {
    try {
      if (get().permission) {
        set({ isFetching: false })
        return true
      }

      set({ isFetching: true })
      const response = await dataProvider.custom({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
        method: 'get',
      })

      const permission = response.data as PermissionType
      set({ permission })

      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false
    } finally {
      set({ isFetching: false })
    }
  },
}))
