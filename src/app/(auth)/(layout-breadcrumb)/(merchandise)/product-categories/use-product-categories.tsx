/* eslint-disable */
import TreeRow from '@components/common/tree/tree-row'
import {
  filterCategoryTree,
  findNode,
  findNodeById,
  getParentId,
  getParentIdOf,
  indexInParent,
  insertNode,
  isDescendant,
  maxDepthOf,
  mergeEditingIntoTree,
  removeNodeById,
  removeNodeUsingId,
  toggleAll,
  toggleOpen,
  toSaveTree,
  updateLevelsRecursively,
  updateNode,
  updateTree,
} from '@components/common/tree/utils/tree-infinity'
import type { CatNode, ITree, SavePayloadNode } from '@interfaces/tree'
import { useTable } from '@refinedev/antd'
import {
  useApiUrl,
  useCreate,
  useCustomMutation,
  useResource,
  useUpdate,
} from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Form, message, type TreeDataNode, type TreeProps } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

const TEMP_PREFIX = 'tmp-'
const MAX_DEPTH = 3

function useProductCategories() {
  const [tree, setTree] = useState<CatNode[]>([])
  const [dirty, setDirty] = useState(false)
  const [editing, setEditing] = useState<
    Record<string, { name: string; original: string }>
  >({})
  const [level, setLevel] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const [form] = Form.useForm()
  const [formFields] = Form.useForm()

  const { resource: rs } = useResource()
  const resource = String(rs?.name)

  const t = useTranslations()
  const { tableProps } = useTable<ITree>()
  const { mutate: createRow, isLoading: isCreating } = useCreate({
    resource,
    invalidates: [],
  })
  const apiUrl = useApiUrl()
  const { mutate: updateAll } = useCustomMutation()

  const hasEditingDescendant = (
    node: CatNode,
    editingKeys: string[],
  ): boolean => {
    if (!node.children || node.children.length === 0) return false
    return node.children.some(
      (child) =>
        editingKeys.includes(String(child.id)) ||
        hasEditingDescendant(child, editingKeys),
    )
  }

  const handleUpdateAll = (values: SavePayloadNode[]) => {
    updateAll({
      url: `${apiUrl}/${resource}/update-tree`,
      method: 'post',
      values,
      successNotification: (res: any) => {
        setEditing({})
        setDirty(false)
        return {
          message: t('notifications.success'),
          description: t('notifications.success'),
          type: 'success',
        }
      },
    })
  }
  const { mutate: updateRow, isLoading: isUpdating } = useUpdate({
    resource,
  })

  const toggle = (id: string | number) =>
    setTree((prev) => toggleOpen(prev, id))

  const addChild = (parentId: string | number) => {
    const parent = findNode(tree, parentId)
    const parentLevel = parent?.level ?? 0

    const tmpId = `tmp-${crypto.randomUUID()}`
    setTree((prev) =>
      updateNode(prev, parentId, (p) => ({
        ...p,
        open: true,
        children: [
          {
            id: tmpId,
            name: '',
            level: parentLevel + 1,
            parent_id: parentId,
            open: false,
            _isNew: true,
            children: [],
          } as CatNode,
          ...((p.children as CatNode[] | undefined) ?? []),
        ],
      })),
    )
    setEditing((prev) => ({ ...prev, [tmpId]: { name: '', original: '' } }))
    setDirty(true)
  }

  const expandedKeys = React.useMemo(() => {
    const keys: string[] = []
    const walk = (nodes: CatNode[]) => {
      for (const n of nodes) {
        if (n.open) keys.push(String(n.id))
        if (n.children?.length) walk(n.children as CatNode[])
      }
    }
    walk(tree)
    return keys
  }, [tree])

  const toLevelLabel = (lv?: number) =>
    lv === 1 ? '大' : lv === 2 ? '中' : '小'

  const addRootCategory = () => {
    const tmpId = `${TEMP_PREFIX}${crypto.randomUUID()}`
    setTree((prev) => [
      {
        id: tmpId,
        name: '',
        level: 1,
        parent_id: null,
        open: true,
        _isNew: true,
        children: [],
      } as CatNode,
      ...prev,
    ])
    setEditing((prev) => ({ ...prev, [tmpId]: { name: '', original: '' } }))
    setDirty(true)
  }

  const del = (id: string | number) => {
    setTree((prev) => removeNodeUsingId(prev, id))
    setDirty(true)
  }

  const save = () => {
    const patched = mergeEditingIntoTree(tree, editing, formFields)

    formFields
      .validateFields()
      .then(() => {
        handleUpdateAll(toSaveTree(patched))
        setTree(patched)
      })
      .catch(() => {
        message.warning(t('product_categories.validate.name_required'))
      })
  }

  const startEdit = (id: string | number) => {
    const node = findNode(tree, id)
    if (!node) return
    setEditing((prev) => ({
      ...prev,
      [id]: { name: node.name, original: node.name },
    }))
    formFields.setFieldValue(node.id, node.name)
    setDirty(true)
  }

  const changeName = (id: string | number, name: string) =>
    setEditing((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], name } } : prev,
    )

  const cancelEdit = (id: string | number) =>
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const saveEdit = (id: string | number) => {
    const node = findNode(tree, id)
    if (!node) return

    const name = formFields.getFieldValue(node.id)
    if (!name) {
      message.warning(t('product_categories.validate.name_required'))
      return
    }

    const parentId = getParentId(tree, id)
    if (node._isNew && (parentId?.startsWith?.(TEMP_PREFIX) ?? false)) {
      message.warning(t('product_categories.validate.save_parent_first'))
      return
    }

    if (node._isNew) {
      createRow(
        {
          values: { name, parent_id: parentId, level: node.level },
        },
        {
          onSuccess: ({ data }) => {
            setTree((prev) =>
              updateNode(prev, id, (n: CatNode) => ({
                ...n,
                _isNew: false,
                ...data,
              })),
            )
            setEditing((prev) => {
              const next = { ...prev }
              delete next[id]
              return next
            })
          },
        },
      )
    } else {
      updateRow(
        { id, values: { name } },
        {
          onSuccess: () => {
            // setTree((prev) =>
            //   updateNode(prev, id, (n: CatNode) => ({
            //     ...n,
            //     ...data,
            //   })),
            // )
            setEditing((prev) => {
              const next = { ...prev }
              delete next[id]
              return next
            })
          },
        },
      )
    }
  }

  const openAll = (open: boolean) => setTree((prev) => toggleAll(prev, open))
  const isAllOpen = (nodes: ITree[]): boolean =>
    nodes.every((n) =>
      n.children?.length ? !!n.open && isAllOpen(n.children) : true,
    )
  const allOpen = useMemo(() => isAllOpen(tree), [tree])

  const breadcrumbItems = [
    {
      title: boldText(t('merchandise.merchandise')),
    },
    {
      title: boldText(t('product_categories.product_categories'), PRIMARY),
    },
  ]

  // load initial data
  useEffect(() => {
    if (tableProps?.dataSource) {
      setTree(tableProps.dataSource as CatNode[])
    }
  }, [tableProps?.dataSource])

  const onDrop: NonNullable<TreeProps['onDrop']> = (info) => {
    const dropKey = String(info.node.key)
    const dragKey = String(info.dragNode.key)
    if (dropKey === dragKey) return

    // Kiểu thả: vào giữa (child) hay khe (trên/dưới)
    const dropPosPath = (info.node as unknown as { pos: string }).pos.split('-')
    const relative =
      info.dropPosition - Number(dropPosPath[dropPosPath.length - 1]) // -1 | 0 | 1

    // Gỡ node kéo ra
    const { removed: dragNode, next } = removeNodeById(
      tree as readonly CatNode[],
      dragKey,
    )
    if (!dragNode) return

    // Tính parent & index chèn
    let targetParentId: string | null
    let insertAt: number

    if (!info.dropToGap) {
      // Thả vào nội dung node -> thành con đầu của dropKey
      targetParentId = dropKey
      insertAt = 0
    } else {
      // Thả vào khe -> cùng cấp với dropKey (trên/dưới)
      targetParentId = getParentIdOf(next, dropKey)
      const dropIndex = indexInParent(next, dropKey)
      if (dropIndex < 0) return
      insertAt = relative === -1 ? dropIndex : dropIndex + 1
    }

    // Không cho thả vào hậu duệ của chính dragNode
    if (targetParentId && isDescendant([dragNode], dragKey, targetParentId))
      return

    // --- QUAN TRỌNG: cập nhật parentId trước khi tính level & chèn
    dragNode.parent_id =
      Number(targetParentId) == 0 ? null : Number(targetParentId)

    // Tính level mới theo parent
    const parentLevel = targetParentId
      ? (findNodeById(next, targetParentId)?.level ?? 0) + 1
      : 1

    updateLevelsRecursively(dragNode, parentLevel)
    if (maxDepthOf(dragNode) > MAX_DEPTH) return

    const afterInsert = insertNode(next, targetParentId, insertAt, dragNode)

    setTree(afterInsert)
    setDirty(true)
  }

  const toTreeData = React.useCallback(
    (nodes: readonly CatNode[]): TreeDataNode[] => {
      const editingKeys = Object.keys(editing)
      return nodes.map((n) => {
        const childrenCount = n.children?.length || 0

        const childIsEditing = hasEditingDescendant(n, editingKeys)
        return {
          key: String(n.id),
          title: (
            <TreeRow
              formFields={formFields}
              isNew={n._isNew}
              cat={n}
              hasChildren={Boolean(n.children?.length)}
              childrenCount={childrenCount}
              onToggle={toggle}
              onAddChild={addChild}
              onStartEdit={startEdit}
              onSave={saveEdit}
              onCancel={cancelEdit}
              editingName={editing?.[String(n.id)]?.name}
              saving={n._isNew ? isCreating : isUpdating}
              canAddChild={(n.level ?? 1) < MAX_DEPTH}
              tag={toLevelLabel(n.level ?? 1)}
              onDelete={() => del(String(n.id))}
              depth={MAX_DEPTH}
              level={n.level ?? 1}
              hasChildEditing={childIsEditing}
            />
          ),
          children: n.children ? toTreeData(n.children) : undefined,
        }
      })
    },
    [
      editing,
      isCreating,
      isUpdating,
      addChild,
      changeName,
      startEdit,
      saveEdit,
      cancelEdit,
      del,
      toggle,
    ],
  )

  const handleSearch = (values: {
    level: number | null
    name: string | null
  }) => {
    setLevel(values.level)
    setCategory(values.name || '')
  }

  const handleClear = () => {
    form.resetFields()
    setLevel(null)
    setCategory(null)
  }

  const filteredTree = useMemo(
    () => filterCategoryTree(tree, level, category),
    [tree, level, category],
  )

  return {
    breadcrumbItems,
    filteredTree,
    toTreeData,
    tableProps,
    dirty,
    allOpen,
    expandedKeys,
    onDrop,
    save,
    handleSearch,
    handleClear,
    addRootCategory,
    openAll,
    form,
    t,
  }
}

export default useProductCategories
