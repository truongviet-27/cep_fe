import type { ITree } from '@interfaces/tree'

function toggleAll(arr: ITree[], open: boolean): ITree[] {
  return arr.map((c) => ({
    ...c,
    open,
    children: c.children ? toggleAll(c.children, open) : undefined,
  }))
}

function updateAt<T extends { id: string }>(
  arr: T[],
  id: string,
  updater: (x: T) => T,
): T[] {
  return arr.map((it) => (it.id === id ? updater(it) : it))
}

function replaceChildren(arr: ITree[], id: string, children: ITree[]): ITree[] {
  return arr.map((it) => (it.id === id ? { ...it, children } : it))
}

function findParentIdOf(
  arr: ITree[],
  id: string,
  parent: string | null = null,
): string | null {
  for (const c of arr) {
    if (c.id === id) return parent
    if (c.children) {
      const r = findParentIdOf(c.children, id, c.id)
      if (r) return r
    }
  }
  return null
}

function getChildrenOf(arr: ITree[], parentId: string | null) {
  if (parentId === null) return arr
  const node = findById(arr, parentId)
  return node?.children ?? null
}

function setChildrenOf(
  arr: ITree[],
  parentId: string | null,
  children: ITree[],
) {
  if (parentId === null) return children
  return replaceChildren(arr, parentId, children)
}

function findById(arr: ITree[], id: string): ITree | undefined {
  for (const c of arr) {
    if (c.id === id) return c
    const hit = c.children && findById(c.children, id)
    if (hit) return hit
  }
  return undefined
}

function findNameById(arr: ITree[], id: string): string {
  return findById(arr, id)?.name ?? ''
}

function toggleOpen(arr: ITree[], id: string): ITree[] {
  return arr.map((c) => {
    if (c.id === id) return { ...c, open: !c.open }
    if (c.children) return { ...c, children: toggleOpen(c.children, id) }
    return c
  })
}

function removeById(arr: ITree[], id: string): ITree[] {
  return arr
    .filter((c) => c.id !== id)
    .map((c) =>
      c.children ? { ...c, children: removeById(c.children, id) } : c,
    )
}

function nextRootCode(list: ITree[]): string {
  const nums = list
    .map((c) => c.code?.match(/^ct(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number)
  const n = nums.length ? Math.max(...nums) + 1 : 1
  return `ct${n}`
}

function updateDeep(
  nodes: ITree[],
  id: string,
  updater: (node: ITree) => ITree,
): [ITree[], boolean] {
  let changed = false

  const next = nodes.map((n) => {
    if (n.id === id) {
      changed = true
      return updater(n)
    }
    if (n.children?.length) {
      const [kids, kidChanged] = updateDeep(n.children, id, updater)
      if (kidChanged) {
        changed = true
        return { ...n, children: kids }
      }
    }
    return n
  })

  return [next, changed]
}

export {
  findById,
  findNameById,
  findParentIdOf,
  getChildrenOf,
  nextRootCode,
  removeById,
  setChildrenOf,
  toggleAll,
  toggleOpen,
  updateAt,
  updateDeep,
}
