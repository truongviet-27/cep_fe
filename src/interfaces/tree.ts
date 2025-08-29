export interface ITree {
  id: string | number
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

export type SavePayloadNode = {
  id: string | number | null
  name: string
  parent_id: string | number | null
  level: number
  order: number
  children?: SavePayloadNode[]
}

export type SaveFlatRow = SavePayloadNode & { path: string }
