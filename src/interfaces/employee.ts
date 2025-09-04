export interface IEmployee {
  id: number
  code: string
  name: string
  email: string
  department_id: number
  role: 'employee' | 'manager'
  created_by: {
    name: string
    date: string
  }
  updated_by: {
    name: string
    date: string
  } | null
}
