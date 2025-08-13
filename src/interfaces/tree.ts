export interface ITree {
  id: string
  name: string
  code?: string
  isPublic?: boolean
  open?: boolean
  children?: ITree[]
}
