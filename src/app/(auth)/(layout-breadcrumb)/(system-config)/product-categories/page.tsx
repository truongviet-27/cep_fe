'use client'

import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons'
import TreeRow from '@components/common/tree/tree-row'
import {
  findNode,
  findNodeById,
  getParentId,
  getParentIdOf,
  indexInParent,
  insertNode,
  isDescendant,
  maxDepthOf,
  removeById,
  removeNodeById,
  toggleAll,
  toggleOpen,
  updateLevelsRecursively,
  updateNode,
} from '@components/common/tree/utils/tree-infinity'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { CatNode, ITree } from '@interfaces/tree'
import { useTable } from '@refinedev/antd'
import { useCreate, useUpdate } from '@refinedev/core'
import { LAYOUT_BG, PRIMARY } from '@utility/color'
import type { TreeDataNode, TreeProps } from 'antd'
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tree,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

const { Title } = Typography

const TEMP_PREFIX = 'tmp-'
const MAX_DEPTH = 3

// const a = '[&_.ant-tree-draggable-icon]:opacity-0'
// const b = ' [&_.ant-tree-indent]:hidden'
const c = '[&_.ant-tree-list-holder-inner]:!w-full'
// const d = ' [&_.ant-tree-node-content-wrapper]:!px-0'
const e = '[&_.ant-tree-switcher]:hidden'
// const f = '[&_.ant-tree-treenode]:!px-0'

export default function Page() {
  const [tree, setTree] = useState<CatNode[]>([])
  const [dirty, setDirty] = useState(false)
  const [editing, setEditing] = useState<
    Record<string, { name: string; original: string }>
  >({})

  const t = useTranslations()
  const { tableProps } = useTable<ITree>()
  const { mutate: createRow } = useCreate()
  const { mutate: updateRow, isLoading: saving } = useUpdate()

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
          ...((p.children as CatNode[] | undefined) ?? []),
          {
            id: tmpId,
            name: '',
            level: parentLevel + 1,
            parent_id: parentId,
            open: false,
            _isNew: true,
            children: [],
          } as CatNode,
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
      ...prev,
      {
        id: tmpId,
        name: '',
        level: 1,
        parent_id: null,
        open: true,
        _isNew: true,
        children: [],
      } as CatNode,
    ])
    setEditing((prev) => ({ ...prev, [tmpId]: { name: '', original: '' } }))
    setDirty(true)
  }

  const del = (id: string | number) => {
    setTree((prev) => removeById(prev, id))
    setDirty(true)
  }

  const save = () => {
    setDirty(false)
    message.success('並べ替えを保存しました')
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
      message.warning('名前を入力してください。')
      return
    }

    const parentId = getParentId(tree, id)
    if (node._isNew && (parentId?.startsWith?.(TEMP_PREFIX) ?? false)) {
      message.warning('先に親カテゴリを保存してください。')
      return
    }

    if (node._isNew) {
      createRow(
        {
          resource: 'product-categories',
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
        { resource: 'product-categories', id, values: { name } },
        {
          onSuccess: () => {
            setTree((prev) =>
              updateNode(prev, id, (n: CatNode) => ({
                ...n,
                name,
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

    if (dropKey === dragKey) return // tự thả vào chính nó -> bỏ

    // Lấy kiểu thả: vào giữa (child) hay khe (trên/dưới)
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

  return (
    <Create
      isLoading={!!tableProps.loading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <Space size={8}>
          <Button
            type="primary"
            disabled={!dirty}
            onClick={save}
            className="shadow-sm disabled:opacity-60"
          >
            並べ替えを保存
          </Button>
          <Button>その他の操作</Button>
        </Space>
      }
    >
      <Form layout="horizontal" colon={false}>
        <Row
          align="middle"
          justify="space-between"
          wrap={false}
          gutter={[16, 16]}
          style={{ width: '100%' }}
        >
          <Col flex="auto">
            <Row align="middle" gutter={24} wrap={false}>
              <Col>
                <div style={{ fontWeight: 600 }}>カテゴリレベル</div>
                <div style={{ marginTop: 8 }}>
                  <Select
                    size="middle"
                    placeholder="選択してください"
                    style={{ width: 240 }}
                    options={[
                      { label: '大', value: 1 },
                      { label: '中', value: 2 },
                      { label: '小', value: 3 },
                    ]}
                  />
                </div>
              </Col>
              <Col>
                <div style={{ fontWeight: 600 }}>カテゴリ名</div>
                <div style={{ marginTop: 8 }}>
                  <Input
                    size="middle"
                    placeholder="部分一致"
                    allowClear
                    style={{ width: 360 }}
                  />
                </div>
              </Col>
              <Col>
                <div style={{ height: 28 }} />
                <div style={{ marginTop: 4 }}>
                  <Space size="middle">
                    <Button type="primary" size="middle">
                      検索
                    </Button>
                    <Button size="middle" type="default">
                      クリア
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Col>
          <Col className="mt-6">
            <Button type="primary" size="middle" onClick={addRootCategory}>
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button
            type="text"
            onClick={() => openAll(!allOpen)}
            icon={allOpen ? <UpOutlined /> : <DownOutlined />}
          >
            {allOpen ? 'すべて閉じる' : 'すべて開く'}
          </Button>
        </div>

        <div
          className={`relative rounded-lg border border-zinc-200 bg-white transition-colors`}
        >
          <Tree
            className={`draggable-tree ${e} ${c}`}
            style={{
              backgroundColor: LAYOUT_BG,
              paddingTop: 4,
            }}
            blockNode
            draggable
            selectable={false}
            expandedKeys={expandedKeys}
            onDrop={onDrop}
            treeData={toTreeData(tree)}
            virtual={false}
            showLine
          />
        </div>
      </div>
    </Create>
  )
}
