import type { CatNode } from '@interfaces/tree'

const findNode = (nodes: CatNode[], id: string): CatNode | null => {
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
  id: string,
  updater: (n: CatNode) => CatNode,
): CatNode[] =>
  nodes.map((n) =>
    n.id === id
      ? updater(n as CatNode)
      : {
          ...(n as CatNode),
          children: n.children
            ? updateNode(n.children as CatNode[], id, updater)
            : n.children,
        },
  )

const getParentId = (
  nodes: CatNode[],
  targetId: string,
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

export { findNode, getParentId, updateNode }
