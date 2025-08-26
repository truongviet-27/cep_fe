import { create } from 'zustand'

interface TenantStore {
  tenantId: string
  setTenant: (tenantId: string) => void
}

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: 'd44bd7e5-2d45-4ec8-acb1-0a82a3412047',
  setTenant: (tenantId) => set({ tenantId }),
}))

export default useTenantStore
