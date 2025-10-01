import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TenantStore {
  tenantId: string | null
  tenantName: string | null
  setTenant: (tenantId: string, tenantName?: string | null) => void
  setTenantName: (tenantName: string | null) => void
}

const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,
      setTenant: (tenantId, tenantName) =>
        set((state) => ({
          tenantId,
          tenantName: tenantName ?? state.tenantName,
        })),
      setTenantName: (tenantName) => set({ tenantName }),
    }),
    { name: 'tenant-store' },
  ),
)

export default useTenantStore
