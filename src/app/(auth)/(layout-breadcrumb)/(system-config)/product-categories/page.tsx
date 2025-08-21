'use client'

import {
  DownOutlined,
  PlusOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons'
import TreeSortable from '@components/common/tree'
import {
  removeById,
  toggleAll,
  toggleOpen,
  updateDeep,
} from '@components/common/tree/utils/tree-infinity'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { ITree } from '@interfaces/tree'
import { useTable } from '@refinedev/antd'
import { useCreate } from '@refinedev/core'
import { LAYOUT_BG, PRIMARY } from '@utility/color'
import { Button, message, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

const { Title } = Typography

export default function Page() {
  const [tree, setTree] = useState<ITree[]>([])
  const [dirty, setDirty] = useState(false)

  const t = useTranslations()

  const { tableProps } = useTable<ITree>()

  const { mutate: createRow, isSuccess } = useCreate()

  const toggle = (id: string) => {
    setTree((prev) => toggleOpen(prev, id))
  }

  const addChild = (id: string, level: number) => {
    setTree((prev) => {
      const newChild: ITree = {
        id: crypto.randomUUID(),
        name: 'New Category',
        isPublic: true,
      }

      const [next, changed] = updateDeep(prev, id, (cat) => ({
        ...cat,
        open: true,
        children: [...(cat.children ?? []), newChild],
      }))

      if (changed) setDirty(true)
      return next
    })

    createRow({
      resource: 'product-categories',
      values: {
        name: crypto.randomUUID(),
        parent_id: id,
        level,
      },
    })
  }

  const edit = () => {
    console.log('aa')
  }
  const del = (id: string) => {
    setTree((prev) => removeById(prev, id))
    setDirty(true)
  }

  const save = async () => {
    setDirty(false)
    message.success('並べ替えを保存しました')
  }

  const openAll = (open: boolean) => setTree((prev) => toggleAll(prev, open))

  const isAllOpen = (nodes: ITree[]): boolean =>
    nodes.every((n) =>
      n.children?.length ? !!n.open && isAllOpen(n.children) : true,
    )

  const allOpen = useMemo(() => isAllOpen(tree), [tree])

  const addRootCategory = () => {
    const id = crypto.randomUUID()

    createRow({
      resource: 'product-categories',
      values: {
        name: id,
        parent_id: null,
        level: 1,
      },
    })

    setDirty(true)
  }

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

  useEffect(() => {
    if (tableProps?.dataSource) {
      setTree(tableProps.dataSource as ITree[])
    }
  }, [tableProps?.dataSource, isSuccess])

  return (
    <Create
      isLoading={false}
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={addRootCategory}
            >
              カテゴリを追加
            </Button>
          </Space>

          <Button
            type="text"
            onClick={() => openAll(!allOpen)}
            icon={allOpen ? <UpOutlined /> : <DownOutlined />}
          >
            {allOpen ? 'すべて閉じる' : 'すべて開く'}
          </Button>
        </div>

        <div
          className={`rounded-xl border border-zinc-200 p-3`}
          style={{ backgroundColor: LAYOUT_BG }}
        >
          {tree.map((cat) => (
            <TreeSortable
              key={cat.id}
              cat={cat}
              onToggle={toggle}
              onAddChild={addChild}
              onEdit={edit}
              onDelete={del}
              depth={3}
            />
          ))}
        </div>
      </div>
    </Create>
  )
}
