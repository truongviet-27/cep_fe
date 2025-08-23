import { create } from 'zustand'

interface TenantStore {
  tenantId: string
  setTenant: (tenantId: string) => void
}

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: '90a925c8-091c-43a5-8d40-e3a9610d1731',
  setTenant: (tenantId) => set({ tenantId }),
}))

export default useTenantStore
