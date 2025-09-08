export interface IDepartments {
  id: number
  name: string
  code: string
  order: number
  tenant_id: string
  author: {
    id: number
    name: string
  }
  editor: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
  number_of_employee: number
}
