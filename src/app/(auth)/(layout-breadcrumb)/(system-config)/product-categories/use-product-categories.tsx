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
  removeById,
  removeNodeById,
  toggleAll,
  toggleOpen,
  toSaveTree,
  updateLevelsRecursively,
  updateNode,
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
import { PRIMARY } from '@utility/color'
import {
  Form,
  message,
  type TreeDataNode,
  type TreeProps,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

const { Title } = Typography

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

  const { resource: rs } = useResource()
  const resource = String(rs?.name)

  const t = useTranslations()
  const { tableProps } = useTable<ITree>()
  const { mutate: createRow } = useCreate({
    resource,
  })
  const apiUrl = useApiUrl()
  const { mutate: updateAll } = useCustomMutation()

  const handleUpdateAll = (values: SavePayloadNode[]) => {
    updateAll({
      url: `${apiUrl}/${resource}/update-tree`,
      method: 'post',
      values,
    })
  }
  const { mutate: updateRow, isLoading: saving } = useUpdate({
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
    setTree((prev) => removeById(prev, id))
    setDirty(true)
  }

  const save = () => {
    const patched = mergeEditingIntoTree(tree, editing)

    setDirty(false)
    handleUpdateAll(toSaveTree(patched))
  }

  const startEdit = (id: string | number) => {
    const node = findNode(tree, id)
    if (!node) return
    setEditing((prev) => ({
      ...prev,
      [id]: { name: node.name, original: node.name },
    }))
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

    const draft = editing[id]
    const name = (draft?.name ?? '').trim()
    if (!name) {
      message.warning(t('product_categories.validate.name_required'))
      return
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
            const newId = String(data?.id)
            setTree((prev) =>
              updateNode(prev, id, (n: CatNode) => ({
                ...n,
                id: newId,
                name,
                _isNew: false,
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
            //     name,
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
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    {
      title: (
        <Title level={5}>{t('product_categories.product_categories')}</Title>
      ),
    },
  ]

  // load initial data
  useEffect(() => {
    if (tableProps?.dataSource) setTree(tableProps.dataSource as CatNode[])
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
    dragNode.parent_id = Number(targetParentId)

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
    (nodes: readonly CatNode[]): TreeDataNode[] =>
      nodes.map((n) => {
        return {
          key: String(n.id),
          title: (
            <TreeRow
              isNew={n._isNew}
              cat={n}
              hasChildren={Boolean(n.children?.length)}
              onToggle={toggle}
              onAddChild={addChild}
              onStartEdit={startEdit}
              onChangeName={changeName}
              onSave={saveEdit}
              onCancel={cancelEdit}
              editingName={editing?.[String(n.id)]?.name}
              saving={saving}
              canAddChild={(n.level ?? 1) < MAX_DEPTH}
              tag={toLevelLabel(n.level ?? 1)}
              onDelete={() => del(String(n.id))}
              depth={MAX_DEPTH}
              level={n.level ?? 1}
            />
          ),
          children: n.children ? toTreeData(n.children) : undefined,
        }
      }),
    [
      editing,
      saving,
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
