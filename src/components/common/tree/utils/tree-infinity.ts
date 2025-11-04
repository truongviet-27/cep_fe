import type {
  CatNode,
  ITree,
  SaveFlatRow,
  SavePayloadNode,
} from '@interfaces/tree'
import type { FormInstance } from 'antd'
import { isNumber } from 'lodash'

function toggleAll(arr: ITree[], open: boolean): ITree[] {
  return arr.map((c) => ({
    ...c,
    open,
    children: c.children ? toggleAll(c.children, open) : undefined,
  }))
}

function findById(arr: ITree[], id: string): ITree | undefined {
  for (const c of arr) {
    if (c.id === id) return c
    const hit = c.children && findById(c.children, id)
    if (hit) return hit
  }
  return undefined
}

function toggleOpen(arr: ITree[], id: string | number): ITree[] {
  return arr.map((c) => {
    if (c.id === id) return { ...c, open: !c.open }
    if (c.children) return { ...c, children: toggleOpen(c.children, id) }
    return c
  })
}

function removeById(arr: CatNode[], id: string | number): ITree[] {
  return arr
    .filter((c) => c.id !== id)
    .map((c) =>
      c.children ? { ...c, children: removeById(c.children, id) } : c,
    )
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
function removeNodeUsingId(
  tree: CatNode[],
  idToRemove: string | number,
): CatNode[] {
  return tree.reduce((accumulator, node) => {
    // 1. Nếu ID của node hiện tại trùng với ID cần xóa, bỏ qua nó.
    if (node.id == idToRemove) {
      return accumulator // Bỏ node này ra khỏi kết quả cuối cùng
    }

    // 2. Nếu node hiện tại có children, gọi đệ quy để xử lý mảng children.
    if (node.children && node.children.length > 0) {
      const newChildren = removeNodeUsingId(
        node.children as CatNode[],
        idToRemove,
      )

      // Tạo một node mới với children đã được cập nhật để đảm bảo immutability
      const newNode = { ...node, children: newChildren }
      accumulator.push(newNode)
    } else {
      // 3. Nếu không phải node cần xóa và không có children, giữ lại nó.
      accumulator.push(node)
    }

    return accumulator
  }, [] as CatNode[])
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
      ...n,
      id: isNumber(n.id) ? n.id : null,
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
  formField: FormInstance,
): CatNode[] =>
  (nodes as CatNode[]).map((n) => {
    const eid = String(n.id)
    const draft = editing[eid]
    const name =
      formField.getFieldValue(eid) ??
      (normalize(draft?.name) || normalize(n.name))

    const clone: CatNode = { ...n, name }
    if (n.children?.length) {
      clone.children = mergeEditingIntoTree(
        n.children as CatNode[],
        editing,
        formField,
      )
    }
    return clone
  })

type Id = string | number

/**
 * Tạo một Map để tra cứu nhanh parentId của một nodeId
 */
const createParentMap = (nodes: CatNode[]): Map<Id, Id> => {
  const map = new Map<Id, Id>()
  const walk = (nodesToWalk: CatNode[], parentId?: Id) => {
    for (const node of nodesToWalk) {
      if (parentId) {
        map.set(node.id, parentId)
      }
      if (node.children?.length) {
        walk(node.children as CatNode[], node.id)
      }
    }
  }
  walk(nodes)
  return map
}

/**
 * Lấy ID của một node và tất cả các con cháu của nó một cách đệ quy
 */
const getDescendantIds = (node: CatNode, idSet: Set<Id>) => {
  idSet.add(node.id)
  if (node.children?.length) {
    for (const child of node.children as CatNode[]) {
      getDescendantIds(child, idSet)
    }
  }
}

// --- Main Filter Function ---

/**
 * Lọc cây category dựa trên level và tên.
 * Kết quả sẽ bao gồm các node khớp, toàn bộ cha và toàn bộ con của chúng.
 * @param nodes - Mảng các node gốc của cây.
 * @param filterLevel - Level cần lọc (ví dụ: 1, 2, 3).
 * @param filterName - Tên category cần tìm (tìm kiếm không phân biệt hoa thường).
 * @returns Một cây mới đã được lọc.
 */
const filterCategoryTree = (
  nodes: CatNode[],
  filterLevel?: number | null,
  filterName?: string | null,
): CatNode[] => {
  const trimmedName = filterName?.trim().toLowerCase()

  // Nếu không có điều kiện lọc, trả về cây gốc
  if (!filterLevel && !trimmedName) {
    return nodes
  }

  const initialMatches: CatNode[] = []
  const requiredIds = new Set<Id>()
  const parentMap = createParentMap(nodes)

  // 1. Tìm tất cả các node ban đầu khớp với điều kiện
  const findInitialMatches = (nodesToSearch: CatNode[]) => {
    for (const node of nodesToSearch) {
      const levelMatches = filterLevel ? node.level === filterLevel : false
      const nameMatches = trimmedName
        ? node.name.toLowerCase().includes(trimmedName)
        : false

      let isMatch = false
      // Nếu cả hai bộ lọc cùng tồn tại, áp dụng logic AND
      if (filterLevel && trimmedName) {
        isMatch = levelMatches && nameMatches
      }
      // Ngược lại, nếu chỉ có một bộ lọc, áp dụng logic OR
      else {
        isMatch = levelMatches || nameMatches
      }

      if (isMatch) {
        initialMatches.push(node)
      }

      if (node.children?.length) {
        findInitialMatches(node.children as CatNode[])
      }
    }
  }
  findInitialMatches(nodes)

  // 2. Từ các node khớp, lấy ID của chúng, tất cả cha và tất cả con
  for (const match of initialMatches) {
    // Lấy ID của chính nó và tất cả con cháu
    getDescendantIds(match, requiredIds)

    // Lấy ID của tất cả cha ông
    let currentId = match.id
    while (parentMap.has(currentId)) {
      const parentId = parentMap.get(currentId)!
      requiredIds.add(parentId)
      currentId = parentId
    }
  }

  // 3. Xây dựng lại cây mới chỉ chứa các node có ID trong `requiredIds`
  const buildFilteredTree = (nodesToBuild: CatNode[]): CatNode[] => {
    return nodesToBuild
      .filter((node) => requiredIds.has(node.id))
      .map((node) => ({
        ...node,
        children: node.children
          ? buildFilteredTree(node.children as CatNode[])
          : [],
      }))
  }

  return buildFilteredTree(nodes)
}

function updateTreeNodes(
  nodes: CatNode[],
  updateMap: Map<string | number, CatNode>,
): CatNode[] {
  if (!nodes || nodes.length === 0) {
    return []
  }

  return nodes.map((node) => {
    const updateInfo = updateMap.get(node.id)

    let newNode: CatNode

    if (updateInfo) {
      const parent_id = updateInfo?.parent_id ?? node?.parent_id
      newNode = {
        ...updateInfo,
        ...node,
        parent_id,
        _isNew: false,
      }
    } else {
      newNode = { ...node }
    }

    if (newNode.children && newNode.children.length > 0) {
      newNode.children = updateTreeNodes(
        newNode.children as CatNode[],
        updateMap,
      )
    }

    return newNode
  })
}

function updateTree(currentTree: CatNode[], updates: CatNode[]): CatNode[] {
  console.log(updates, 'updates')

  const updateMap = new Map<string | number, CatNode>(
    updates.map((u) => [u.id, u]),
  )
  return updateTreeNodes(currentTree, updateMap)
}

export {
  deepClone,
  filterCategoryTree,
  findById,
  findNode,
  findNodeById,
  findParentAndIndex,
  getParentId,
  getParentIdOf,
  indexInParent,
  insertNode,
  isDescendant,
  maxDepthOf,
  mergeEditingIntoTree,
  removeById,
  removeNodeById,
  removeNodeUsingId,
  toggleAll,
  toggleOpen,
  toSaveFlat,
  toSaveTree,
  updateDeep,
  updateLevelsRecursively,
  updateNode,
  updateTree,
}
