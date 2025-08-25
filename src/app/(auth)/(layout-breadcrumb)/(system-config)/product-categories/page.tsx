'use client'

import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons'
import CommonTree from '@components/common/tree'
import {
  removeById,
  toggleAll,
  toggleOpen,
} from '@components/common/tree/utils/tree-infinity'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { CatNode, ITree } from '@interfaces/tree'
import { useTable } from '@refinedev/antd'
import { useCreate, useUpdate } from '@refinedev/core'
import { LAYOUT_BG, PRIMARY } from '@utility/color'
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

import { findNode, getParentId, updateNode } from './utils'

const { Title } = Typography

const TEMP_PREFIX = 'tmp-'

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

  const toggle = (id: string) => setTree((prev) => toggleOpen(prev, id))

  // Add child: tạo DRAFT (không gọi API), bật edit
  const addChild = (parentId: string, level: number) => {
    const tmpId = `${TEMP_PREFIX}${crypto.randomUUID()}`
    setTree((prev) =>
      updateNode(prev, parentId, (p) => {
        const children = (p.children as CatNode[] | undefined) ?? []
        return {
          ...(p as CatNode),
          open: true,
          children: [
            ...children,
            {
              id: tmpId,
              name: '',
              level: level + 1,
              parent_id: parentId,
              open: false,
              _isNew: true,
              children: [],
            } as CatNode,
          ],
        }
      }),
    )
    setEditing((prev) => ({ ...prev, [tmpId]: { name: '', original: '' } }))
    setDirty(true)
  }

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

  const del = (id: string) => {
    setTree((prev) => removeById(prev, id))
    setDirty(true)
  }

  // nút lưu sắp xếp (giữ UI cũ)
  const save = () => {
    setDirty(false)
    message.success('並べ替えを保存しました')
  }

  const startEdit = (id: string) => {
    const node = findNode(tree, id)
    if (!node) return
    setEditing((prev) => ({
      ...prev,
      [id]: { name: node.name, original: node.name },
    }))
  }

  const changeName = (id: string, name: string) =>
    setEditing((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], name } } : prev,
    )

  const cancelEdit = (id: string) =>
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const saveEdit = (id: string) => {
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
              updateNode(prev, id, (n) => ({
                ...(n as CatNode),
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
              updateNode(prev, id, (n) => ({ ...(n as CatNode), name })),
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
      {/* search bar - giữ nguyên UI */}
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

      {/* tree list */}
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
          className="rounded-xl border border-zinc-200 p-2"
          style={{ backgroundColor: LAYOUT_BG }}
        >
          {tree.map((cat) => (
            <CommonTree
              key={cat.id}
              loading={!!tableProps.loading}
              cat={cat}
              onToggle={toggle}
              onAddChild={addChild}
              onStartEdit={startEdit}
              editing={editing}
              onChangeName={changeName}
              onSave={saveEdit}
              onCancel={cancelEdit}
              onDelete={del}
              depth={2}
              saving={saving}
            />
          ))}
        </div>
      </div>
    </Create>
  )
}
