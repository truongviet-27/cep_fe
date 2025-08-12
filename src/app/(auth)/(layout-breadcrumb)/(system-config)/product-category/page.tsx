'use client'

import {
  CloudUploadOutlined,
  DownOutlined,
  MoreOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { CommonCreate } from '@components/common/create'
import TreeSortable from '@components/common/tree-sortable'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { ITree } from '@interfaces/tree'
import { fetchCategories } from '@mockApi/categories'
import { PRIMARY } from '@utility/color'
import {
  collectOrder,
  removeById,
  uid,
  updateNode,
  walk,
} from '@utility/tree-infinity'
import type { MenuProps } from 'antd'
import { App, Button, Dropdown, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

const { Title } = Typography

export default function ProductCategoryPage() {
  const { message, modal } = App.useApp?.() ?? {
    message: { success: console.log },
    modal: { confirm: console.log },
  }

  const [items, setItems] = useState<ITree[]>([])
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const t = useTranslations()

  useEffect(() => {
    fetchCategories().then((data) => {
      setItems(data)
      const init = new Set<string>()
      walk(data, (c) => {
        if (c.children?.length) init.add(c.id)
      })
      setOpenIds(init)
    })
  }, [])

  const allIds = useMemo(() => {
    const ids: string[] = []
    walk(items, (c) => {
      ids.push(c.id)
    })
    return ids
  }, [items])

  const allOpen = useMemo(
    () => allIds.length > 0 && allIds.every((id) => openIds.has(id)),
    [allIds, openIds],
  )

  const toggleAll = () =>
    setOpenIds(() => (allOpen ? new Set() : new Set(allIds)))

  const addRoot = () =>
    setItems((prev) => [
      ...prev,
      { id: uid(), name: 'New Category', public: true },
    ])

  const addChild = (id: string) => {
    const child: ITree = { id: uid(), name: 'New Subcategory', public: true }
    setItems((prev) =>
      updateNode(prev, id, (c) => {
        c.children = [...(c.children || []), child]
      }),
    )
    setOpenIds((s) => new Set(s).add(id))
  }

  const edit = (id: string) => {
    const name = window.prompt('カテゴリ名を入力', '')
    if (!name) return
    setItems((prev) =>
      updateNode(prev, id, (c) => {
        c.name = name
      }),
    )
  }

  const remove = (id: string) => {
    modal.confirm?.({
      title: '削除しますか？',
      onOk: () => setItems((prev) => removeById(prev, id)),
    })
  }

  const saveOrder = () => {
    const order = collectOrder(items)
    console.log(order)
    message.success?.('並べ替えを保存しました')
  }

  const moreMenu: MenuProps['items'] = [
    { key: 'import', icon: <CloudUploadOutlined />, label: 'インポート' },
    { type: 'divider' },
    { key: 'other', label: 'その他' },
  ]

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('breadcrumb.system')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('systemConfig.permissionSettings')}</Title>,
    },
  ]

  return (
    <CommonCreate
      isLoading={false}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <>
          <Button
            type="primary"
            size="large"
            onClick={saveOrder}
            className="rounded-xl px-8"
          >
            並べ替えを保存
          </Button>
          <Button size="large" className="rounded-xl">
            その他の操作
          </Button>
        </>
      }
    >
      <div className="px-6">
        <div className="mt-2 mb-4 flex items-center justify-end">
          <Space>
            <Button type="text" icon={<CloudUploadOutlined />}>
              アップロード
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={addRoot}>
              カテゴリを追加
            </Button>
            <Dropdown menu={{ items: moreMenu }} trigger={['click']}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        </div>

        <div className="mb-2 text-right">
          <Button type="text" onClick={toggleAll}>
            すべて{allOpen ? '閉じる' : '開く'} <DownOutlined />
          </Button>
        </div>

        <TreeSortable
          list={items}
          setList={setItems}
          openSet={openIds}
          setOpenSet={setOpenIds}
          isRoot
          edit={edit}
          remove={remove}
          addChild={addChild}
        />
      </div>
    </CommonCreate>
  )
}
