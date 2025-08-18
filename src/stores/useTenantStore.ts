import { create } from 'zustand'

interface TenantStore {
  tenantId: number
  setTenant: (tenantId: number) => void
}

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: 1,
  setTenant: (tenantId) => set({ tenantId }),
}))

export default useTenantStore
