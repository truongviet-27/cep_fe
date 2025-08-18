// import { create } from 'zustand'
//
// interface Tenant {
//   id: number
//   name: string | null
// }
//
// interface SessionStore {
//   tenant: Tenant
//   setTenant: (tenant: Tenant) => void
//   token: string | null
//   setToken: (token: string) => void
// }
//
// const useSessionStore = create<SessionStore>((set) => ({
//   tenant: {
//     id: 1,
//     name: '株式会社ピオネロ',
//   },
//   setTenant: (tenant) => set({ tenant }),
//   token: null,
//   setToken: (token) => set({ token }),
// }))
//
// export default useSessionStore
