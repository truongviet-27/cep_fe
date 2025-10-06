import type { ProductPackagingInput } from '@sdk/hey-api'

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

export type ProductPackagingInputType = ProductPackagingInput & {
  [key: `rank_${number}`]: number | undefined
}
