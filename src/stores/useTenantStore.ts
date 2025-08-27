import { create } from 'zustand'

interface TenantStore {
  tenantId: string | null
  setTenant: (tenantId: string) => void
}

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: null,
  setTenant: (tenantId) => set({ tenantId }),
}))

export default useTenantStore
