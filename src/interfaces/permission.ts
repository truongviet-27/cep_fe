import type { PermissionEnum } from '@sdk/hey-api'

export type PermissionType = {
  is_module_admin: boolean
  role: {
    id: number
    name: string
    display_name: string
  }
  permissions: PermissionEnum[]
}
