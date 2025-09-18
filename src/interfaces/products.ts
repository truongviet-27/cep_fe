export interface IProject {
  id: number
  projectCode: string
  projectName: string
  customers: string
  author: string
  updatedDate: string
  createdAt?: string
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled'
  description?: string
}
