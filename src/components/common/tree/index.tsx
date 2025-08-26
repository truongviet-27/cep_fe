'use client'

import LoadingPage from '@components/common/loading-page'
import TreeRow from '@components/common/tree/tree-row'
import type { ITree } from '@interfaces/tree'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type EditingMap = Record<string, { name: string }>

type Props = {
  cat: ITree
  onToggle: (id: string | number) => void
  onAddChild: (id: string | number, level: number) => void
  onStartEdit: (id: string | number) => void
  onChangeName: (id: string | number, name: string) => void
  onSave: (id: string | number) => void
  onCancel: (id: string | number) => void
  editing?: EditingMap
  saving?: boolean
  onDelete: (id: string | number) => void
  loading?: boolean
  depth?: number
  level?: number
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
  level = 1, // <- default: root
}: Props) {
  const withinLimit = (lv: number) => (depth === undefined ? true : lv < depth)
  const canShowChildren = (lv: number) =>
    depth === undefined ? true : lv < depth

  const getLevelLabel = (lv: number): string => {
    if (lv === 1) return '大'
    if (lv === 2) return '中'
    return '小'
  }

  const renderNode = (node: ITree, lv: number) => {
    const children = node.children ?? []
    const hasActualChildren = children.length > 0

    const canAddChild = withinLimit(lv)
    const hasChildrenForToggle = hasActualChildren && withinLimit(lv)
    const shouldRenderChildren =
      hasActualChildren && node.open && canShowChildren(lv)

    if (loading) return <LoadingPage />

    return (
      <div key={node.id} className="mb-2 last:mb-0">
        <TreeRow
          cat={node}
          hasChildren={hasChildrenForToggle}
          onToggle={onToggle}
          onAddChild={(id) => onAddChild(id, lv)}
          onStartEdit={onStartEdit}
          onChangeName={onChangeName}
          onSave={onSave}
          onCancel={onCancel}
          editingName={editing?.[String(node.id)]?.name}
          saving={saving}
          canAddChild={canAddChild}
          tag={getLevelLabel(lv)}
          onDelete={() => onDelete(String(node.id))}
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
                  onDelete={onDelete}
                  depth={depth}
                  level={lv + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return renderNode(cat, level)
}
