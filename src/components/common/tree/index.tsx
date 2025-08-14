import TreeRow from '@components/common/tree/tree-row'
import type { ITree } from '@interfaces/tree'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type Props = {
  cat: ITree
  onToggle: (id: string) => void
  onAddChild: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  depth?: number
}

export default function CommonTree({
  cat,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
  depth,
}: Props) {
  const withinLimit = (level: number) =>
    depth === undefined ? true : level < depth

  const canShowChildren = (level: number) =>
    depth === undefined ? true : level < depth

  const renderNode = (node: ITree, level: number) => {
    const children = node.children ?? []
    const hasActualChildren = children.length > 0

    const canAddChild = withinLimit(level)
    const hasChildrenForToggle = hasActualChildren && withinLimit(level)
    const shouldRenderChildren =
      hasActualChildren && node.open && canShowChildren(level)

    return (
      <div key={node.id} className="mb-2 last:mb-0">
        <TreeRow
          cat={node}
          hasChildren={hasChildrenForToggle}
          onToggle={onToggle}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
          canAddChild={canAddChild}
        />

        <AnimatePresence initial={false}>
          {shouldRenderChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="pl-9"
            >
              {children.map((ch) => renderNode(ch, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return renderNode(cat, 1)
}
