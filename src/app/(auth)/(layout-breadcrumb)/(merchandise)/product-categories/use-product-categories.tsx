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
import { PermissionEnum } from '@sdk/hey-api'
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
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState<
    Record<string, { name: string; original: string }>
  >({})
  const [level, setLevel] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const originalTreeRef = React.useRef<CatNode[]>([])

  const [form] = Form.useForm()
  const [formFields] = Form.useForm()

  const { resource: rs } = useResource()
  const resource = String(rs?.name)

  const t = useTranslations()
  const { tableProps, tableQueryResult } = useTable<ITree>()
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

  const checkIfDirty = (
    currentEditing?: Record<string, { name: string; original: string }>,
    currentTree?: CatNode[],
  ) => {
    const editingToCheck =
      currentEditing !== undefined ? currentEditing : editing
    const treeToCheck = currentTree !== undefined ? currentTree : tree

    // check if there is any node being edited
    if (Object.keys(editingToCheck).length > 0) {
      setDirty(true)
      return
    }

    // check if there is any new node (_isNew)
    const hasNewNodes = (nodes: CatNode[]): boolean => {
      return nodes.some(
        (n) => n._isNew || (n.children && hasNewNodes(n.children as CatNode[])),
      )
    }
    if (hasNewNodes(treeToCheck)) {
      setDirty(true)
      return
    }

    // compare the tree structure with the original
    const treeChanged =
      JSON.stringify(treeToCheck) !== JSON.stringify(originalTreeRef.current)
    setDirty(treeChanged)
  }

  const handleUpdateAll = (
    values: SavePayloadNode[],
    savedTree?: CatNode[],
    onSuccess?: () => void,
  ) => {
    updateAll(
      {
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
      },
      {
        onSuccess: () => {
          onSuccess?.()
          // after successful save, update originalTreeRef
          setTimeout(() => {
            originalTreeRef.current = savedTree ?? tree
          }, 100)
        },
        onError: () => {
          setIsSaving(false)
        },
      },
    )
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
    const newTree = updateNode(tree, parentId, (p) => ({
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
    }))
    setTree(newTree)
    const newEditing = { ...editing, [tmpId]: { name: '', original: '' } }
    setEditing(newEditing)
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
    const newTree = [
      {
        id: tmpId,
        name: '',
        level: 1,
        parent_id: null,
        open: true,
        _isNew: true,
        children: [],
      } as CatNode,
      ...tree,
    ]
    setTree(newTree)
    const newEditing = { ...editing, [tmpId]: { name: '', original: '' } }
    setEditing(newEditing)
    setDirty(true)
  }

  const del = (id: string | number) => {
    const newTree = removeNodeUsingId(tree, id)
    setTree(newTree)
    setTimeout(() => checkIfDirty(editing, newTree), 0)
  }

  const removeTmpNodes = (nodes: CatNode[]): CatNode[] => {
    return nodes
      .filter((node) => !String(node.id).startsWith(TEMP_PREFIX))
      .map((node) => ({
        ...node,
        children: node.children
          ? (removeTmpNodes(node.children as CatNode[]) as any)
          : node.children,
      }))
  }

  const save = () => {
    const patched = mergeEditingIntoTree(tree, editing, formFields)

    formFields
      .validateFields()
      .then(() => {
        setIsSaving(true)
        // Keep latest typed names in UI while waiting refetch
        setTree(patched)
        handleUpdateAll(toSaveTree(patched), patched, () => {
          // after API successful, refetch data from server to delete tmp
          tableQueryResult?.refetch().then(() => {
            // new data has been loaded, tmp has been deleted
          })
        })
      })
      .catch(() => {
        message.warning(t('product_categories.validate.name_required'))
      })
  }

  const startEdit = (id: string | number) => {
    const node = findNode(tree, id)
    if (!node) return
    const newEditing = {
      ...editing,
      [id]: { name: node.name, original: node.name },
    }
    setEditing(newEditing)
    formFields.setFieldValue(node.id, node.name)
    setDirty(true)
  }

  const changeName = (id: string | number, name: string) =>
    setEditing((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], name } } : prev,
    )

  const cancelEdit = (id: string | number) => {
    const next = { ...editing }
    delete next[id]
    setEditing(next)
    setTimeout(() => checkIfDirty(next, tree), 0)
  }

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
            const updatedTree = updateNode(tree, id, (n: CatNode) => ({
              ...n,
              _isNew: false,
              ...data,
            }))
            setTree(updatedTree)
            const next = { ...editing }
            delete next[id]
            setEditing(next)
            setTimeout(() => {
              originalTreeRef.current = updatedTree
              checkIfDirty(next, updatedTree)
            }, 0)
          },
        },
      )
    } else {
      updateRow(
        { id, values: { name } },
        {
          onSuccess: () => {
            const next = { ...editing }
            delete next[id]
            setEditing(next)
            setTimeout(() => {
              originalTreeRef.current = tree
              checkIfDirty(next, tree)
            }, 0)
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
      const data = tableProps.dataSource as CatNode[]
      setTree(data)
      originalTreeRef.current = data
      setDirty(false)
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
    setTimeout(() => checkIfDirty(editing, afterInsert), 0)
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
              permissionEnum={PermissionEnum.PRODUCT_CATEGORY_EDIT}
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
    isSaving,
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
