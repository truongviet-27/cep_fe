export interface ITree {
  id: string
  name: string
  code?: string
  isPublic?: boolean
  open?: boolean
  children?: ITree[]
}

export type CatNode = ITree & {
  _isNew?: boolean
  parent_id?: string | null
  level?: number
}
