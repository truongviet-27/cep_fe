import type { PermissionType } from '@interfaces/permission'
import { dataProvider } from '@providers/data-provider'
import { create } from 'zustand'

type UserStore = {
  isFetching: boolean
  permission: PermissionType | null
  logout?: () => void
  useSyncUser: () => Promise<boolean>
}

export const useUserStore = create<UserStore>((set, get) => ({
  isFetching: false,
  permission: null,
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

      const permission = {
        ...response.data,
        permissions: new Set(response.data.permissions),
      } as PermissionType

      set({ permission, isFetching: false })

      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false
    } finally {
      set({ isFetching: false })
    }
  },
}))
