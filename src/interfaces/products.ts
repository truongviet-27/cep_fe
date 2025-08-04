export interface IProject {
  id: number
  projectCode: string
  projectName: string
  customer: string
  author: string
  updatedDate: string
  createdAt?: string
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled'
  description?: string
}
