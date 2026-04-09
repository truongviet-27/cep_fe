export interface Manual {
  id: number
  tenant_id?: string
  module?: string | null
  type?: string | null
  group?: string | null
  category?: 'system' | 'user' | 'system_all' | null
  step?: number
  name: string
  description: string
  note?: string | null
  note_warning?: string | null
  link?: string | null
  app_type?: 'quota' | 'control' | string | null
  breadcrumb?: string | null
  status: 'complete' | 'pending'
  created_at?: string
  updated_at?: string
}
