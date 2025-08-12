import type { ITree } from '@interfaces/tree'

const uid = () =>
  crypto?.randomUUID?.() ??
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

const deepClone = <T>(x: T): T => JSON.parse(JSON.stringify(x))

function walk<T>(
  nodes: ITree[],
  fn: (c: ITree, parent?: ITree) => T | void,
  parent?: ITree,
): T | undefined {
  for (const n of nodes) {
    const r = fn(n, parent)
    if (r !== undefined) return r as T
    if (n.children?.length) {
      const rr = walk(n.children, fn, n)
      if (rr !== undefined) return rr
    }
  }
  return undefined
}

function updateNode(
  nodes: ITree[],
  id: string,
  updater: (c: ITree, parent?: ITree) => void,
) {
  const root = deepClone(nodes)
  walk(root, (c, p) => {
    if (c.id === id) {
      updater(c, p)
      return true
    }
  })
  return root
}

function removeById(nodes: ITree[], id: string) {
  const root = deepClone(nodes)
  const removeIn = (arr?: ITree[]) => {
    if (!arr) return
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].id === id) arr.splice(i, 1)
      else removeIn(arr[i].children)
    }
  }
  removeIn(root)
  return root
}

function collectOrder(list: ITree[]) {
  const result = {
    root: list.map((c) => c.id),
    children: {} as Record<string, string[]>,
  }
  walk(list, (c) => {
    if (c.children?.length) result.children[c.id] = c.children.map((x) => x.id)
  })
  return result
}

export { collectOrder, removeById, uid, updateNode, walk }
