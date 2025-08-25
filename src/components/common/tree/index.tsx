import LoadingPage from '@components/common/loading-page'
import TreeRow from '@components/common/tree/tree-row'
import type { ITree } from '@interfaces/tree'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type EditingMap = Record<string, { name: string }>

type Props = {
  cat: ITree
  onToggle: (id: string) => void
  onAddChild: (id: string, level: number) => void
  onStartEdit: (id: string) => void
  onChangeName: (id: string, name: string) => void
  onSave: (id: string) => void
  onCancel: (id: string) => void
  editing?: EditingMap
  saving?: boolean
  onDelete: (id: string) => void
  loading?: boolean
  depth?: number
}

export default function CommonTree({
  cat,
  onToggle,
  onAddChild,
  onStartEdit,
  onChangeName,
  onSave,
  onCancel,
  editing,
  saving,
  depth,
  loading,
  onDelete,
}: Props) {
  const withinLimit = (level: number) =>
    depth === undefined ? true : level < depth
  const canShowChildren = (level: number) =>
    depth === undefined ? true : level < depth

  function getLevelLabel(level: number): string {
    if (level === 1) return '大'
    if (level === 2) return '中'
    return '小'
  }

  const renderNode = (node: ITree, level: number) => {
    const children = node.children ?? []
    const hasActualChildren = children.length > 0

    const canAddChild = withinLimit(level)
    const hasChildrenForToggle = hasActualChildren && withinLimit(level)
    const shouldRenderChildren =
      hasActualChildren && node.open && canShowChildren(level)

    if (loading) return <LoadingPage />

    return (
      <div key={node.id} className="mb-2 last:mb-0">
        <TreeRow
          cat={node}
          hasChildren={hasChildrenForToggle}
          onToggle={onToggle}
          onAddChild={(id) => onAddChild(id, level)}
          onStartEdit={onStartEdit}
          onChangeName={onChangeName}
          onSave={onSave}
          onCancel={onCancel}
          editingName={editing?.[String(node.id)]?.name}
          saving={saving}
          canAddChild={canAddChild}
          tag={getLevelLabel(level)}
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
              {children.map((ch) => (
                <CommonTree
                  key={ch.id}
                  cat={ch}
                  onToggle={onToggle}
                  onAddChild={onAddChild}
                  onStartEdit={onStartEdit}
                  onChangeName={onChangeName}
                  onSave={onSave}
                  onCancel={onCancel}
                  editing={editing}
                  saving={saving}
                  onDelete={() => onDelete(ch.id)}
                  depth={depth}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return renderNode(cat, 1)
}
