'use client'

import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons'
import TreeSortable from '@components/common/tree'
import {
  removeById,
  toggleAll,
  toggleOpen,
} from '@components/common/tree/utils/tree-infinity'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { ITree } from '@interfaces/tree'
import { useTable } from '@refinedev/antd'
import { useCreate } from '@refinedev/core'
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
    // setTree((prev) => {
    //   const newChild: ITree = {
    //     id: crypto.randomUUID(),
    //     name: 'New Category',
    //     isPublic: true,
    //   }
    //
    //   const [next, changed] = updateDeep(prev, id, (cat) => ({
    //     ...cat,
    //     open: true,
    //     children: [...(cat.children ?? []), newChild],
    //   }))
    //
    //   if (changed) setDirty(true)
    //   return next
    // })

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
                <div style={{ height: 28 }} /> {/* căn hàng với labels */}
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

          <Col className={'mt-6'}>
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
          className={`rounded-xl border border-zinc-200 p-2`}
          style={{ backgroundColor: LAYOUT_BG }}
        >
          {tree.map((cat) => (
            <TreeSortable
              loading={!!tableProps.loading}
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
