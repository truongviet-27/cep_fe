import type {
  CatNode,
  ITree,
  SaveFlatRow,
  SavePayloadNode,
} from '@interfaces/tree'

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

function toggleOpen(arr: ITree[], id: string | number): ITree[] {
  return arr.map((c) => {
    if (c.id === id) return { ...c, open: !c.open }
    if (c.children) return { ...c, children: toggleOpen(c.children, id) }
    return c
  })
}

function removeById(arr: ITree[], id: string | number): ITree[] {
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

const deepClone = <T>(v: T): T => structuredClone(v)

const findParentAndIndex = (
  nodes: readonly CatNode[],
  id: string,
  parent: CatNode | null = null,
): {
  parent: CatNode | null
  index: number
  container: CatNode[]
} | null => {
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i]
    if (String(n.id) === id) {
      return { parent, index: i, container: nodes as CatNode[] }
    }
    if (n.children?.length) {
      const r = findParentAndIndex(n.children, id, n)
      if (r) return r
    }
  }
  return null
}

const removeNodeById = (
  nodes: readonly CatNode[],
  id: string,
): { removed: CatNode | null; next: CatNode[] } => {
  const root = deepClone(nodes) as CatNode[]
  const where = findParentAndIndex(root, id)
  if (!where) return { removed: null, next: root }
  const { container, index } = where
  const [removed] = container.splice(index, 1)
  return { removed: removed ?? null, next: root }
}

const getParentIdOf = (
  nodes: readonly CatNode[],
  id: string,
): string | null => {
  const where = findParentAndIndex(nodes, id)
  if (!where) return null
  return where.parent ? String(where.parent.id) : null
}

const indexInParent = (nodes: readonly CatNode[], id: string): number => {
  const where = findParentAndIndex(nodes, id)
  return where ? where.index : -1
}

const findNodeById = (
  nodes: readonly CatNode[],
  id: string,
): CatNode | null => {
  const stack: CatNode[] = [...(nodes as CatNode[])]
  while (stack.length) {
    const cur = stack.pop() as CatNode
    if (String(cur.id) === id) return cur
    if (cur.children?.length) stack.push(...cur.children)
  }
  return null
}

const isDescendant = (
  nodes: readonly CatNode[],
  ancestorId: string,
  targetId: string,
): boolean => {
  const ancestor = findNodeById(nodes, ancestorId)
  if (!ancestor) return false
  const stack: CatNode[] = [...(ancestor.children ?? [])]
  while (stack.length) {
    const cur = stack.pop() as CatNode
    if (String(cur.id) === targetId) return true
    if (cur.children?.length) stack.push(...cur.children)
  }
  return false
}

const updateLevelsRecursively = (node: CatNode, startLevel: number): void => {
  // cập nhật level cho node và toàn bộ con cháu
  // (không chạm các field khác => giữ nguyên logic)
  node.level = startLevel
  if (node.children?.length) {
    for (const c of node.children) updateLevelsRecursively(c, startLevel + 1)
  }
}

const maxDepthOf = (node: CatNode): number => {
  let maxD = node.level ?? 1
  if (node.children?.length) {
    for (const c of node.children) {
      const childMax = maxDepthOf(c)
      maxD = Math.max(maxD, childMax)
    }
  }
  return maxD
}

const insertNode = (
  nodes: readonly CatNode[],
  parentId: string | null,
  at: number,
  node: CatNode,
): CatNode[] => {
  const root = deepClone(nodes) as CatNode[]
  if (parentId === null) {
    const safeAt = Math.max(0, Math.min(at, root.length))
    root.splice(safeAt, 0, node)
    return root
  }
  const parent = findNodeById(root, parentId)
  if (!parent) return root
  const arr = deepClone(parent.children ?? []) as CatNode[]
  const safeAt = Math.max(0, Math.min(at, arr.length))
  arr.splice(safeAt, 0, node)
  parent.children = arr
  return root
}

const findNode = (nodes: CatNode[], id: string | number): CatNode | null => {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children?.length) {
      const f = findNode(n.children as CatNode[], id)
      if (f) return f
    }
  }
  return null
}

const updateNode = (
  nodes: CatNode[],
  id: string | number,
  updater: (n: CatNode) => CatNode,
): CatNode[] =>
  nodes.map((n) =>
    n.id === id
      ? updater(n)
      : {
          ...n,
          children: n.children
            ? updateNode(n.children as CatNode[], id, updater)
            : n.children,
        },
  )

const getParentId = (
  nodes: CatNode[],
  targetId: string | number,
  parent: string | null = null,
): string | null => {
  for (const n of nodes) {
    if (n.id === targetId) return parent
    if (n.children?.length) {
      const p = getParentId(n.children as CatNode[], targetId, n.id as string)
      if (p !== null) return p
    }
  }
  return null
}

const toSaveTree = (nodes: CatNode[], order: number = 0): SavePayloadNode[] => {
  return (nodes ?? []).map((n) => {
    return {
      id: n.id,
      name: (n.name ?? '').trim(),
      parent_id: n.parent_id ?? null,
      level: n.level ?? 1,
      order: ++order,
      children: n.children?.length ? toSaveTree(n.children, order) : undefined,
    }
  })
}

const toSaveFlat = (
  nodes: CatNode[],
  parentId: string | number | null = null,
  path = '',
): SaveFlatRow[] => {
  const acc: SaveFlatRow[] = []
  ;(nodes ?? []).forEach((n, i) => {
    const order = i + 1
    const curPath = path
      ? `${path}.${String(order).padStart(3, '0')}`
      : String(order).padStart(3, '0')
    acc.push({
      id: n.id,
      name: (n.name ?? '').trim(),
      parent_id: parentId,
      level: n.level ?? 1,
      order,
      path: curPath,
    })
    if (n.children?.length) {
      acc.push(...toSaveFlat(n.children, n.id, curPath))
    }
  })
  return acc
}
const normalize = (s?: string) => (s ?? '').trim()

const mergeEditingIntoTree = (
  nodes: readonly CatNode[],
  editing: Record<string, { name: string; original: string }>,
): CatNode[] =>
  (nodes as CatNode[]).map((n) => {
    const eid = String(n.id)
    const draft = editing[eid]
    const name = normalize(draft?.name) || normalize(n.name)

    const clone: CatNode = { ...n, name }
    if (n.children?.length) {
      clone.children = mergeEditingIntoTree(n.children as CatNode[], editing)
    }
    return clone
  })

export {
  deepClone,
  findById,
  findNameById,
  findNode,
  findNodeById,
  findParentAndIndex,
  getChildrenOf,
  getParentId,
  getParentIdOf,
  indexInParent,
  insertNode,
  isDescendant,
  maxDepthOf,
  mergeEditingIntoTree,
  nextRootCode,
  removeById,
  removeNodeById,
  setChildrenOf,
  toggleAll,
  toggleOpen,
  toSaveFlat,
  toSaveTree,
  updateAt,
  updateDeep,
  updateLevelsRecursively,
  updateNode,
}
