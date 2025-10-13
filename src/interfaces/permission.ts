import type { ParameterResourceEnum, PermissionEnum } from '@sdk/hey-api'

export type PermissionType = {
  is_module_admin: boolean
  role: {
    id: number
    name: string
    display_name: string
  }
  user?: {
    id: number
    name: string
  }
  permissions: Set<PermissionEnum>
}

export type ParameterSettingType = Map<ParameterResourceEnum, boolean>
