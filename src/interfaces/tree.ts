export interface ITree {
  id: string
  name: string
  public: boolean
  children?: ITree[]
}
