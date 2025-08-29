/* eslint-disable */
'use client'

import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useResource, useTranslate, useUpdate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, message, Row, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const { Title } = Typography

type Department = {
  id: string | number
  name: string
  code: string
  created_by?: string
  updated_by?: string
  created_at?: string
  updated_at?: string
  number_of_employee?: number
  order?: number
}

type RowVM = Department & { __index: number }

export default function Page() {
  const t = useTranslate()
  const { resource } = useResource()

  const { tableProps, searchFormProps } = useTable<Department>({
    syncWithLocation: true,
  })

  const [rows, setRows] = useState<Department[]>([])
  const originalOrderRef = useRef<string[]>([])

  useEffect(() => {
    const ds = (tableProps?.dataSource as Department[]) ?? []
    setRows(ds)
    originalOrderRef.current = ds.map((r) => String(r.id))
  }, [tableProps?.dataSource])

  const getRowId = (r: Department) => String(r.id)

  const onDragEnd = (activeId: string, overId: string | null) => {
    if (!overId || activeId === overId) return
    setRows((prev) => {
      const from = prev.findIndex((r) => getRowId(r) === activeId)
      const to = prev.findIndex((r) => getRowId(r) === overId)
      if (from === -1 || to === -1 || from === to) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const isDirty = useMemo(() => {
    const current = rows.map((r) => String(r.id))
    const orig = originalOrderRef.current
    if (current.length !== orig.length) return true
    for (let i = 0; i < current.length; i++)
      if (current[i] !== orig[i]) return true
    return false
  }, [rows])

  // ===== Save All (update order only) =====
  const { mutate: updateOne, isLoading: savingAll } = useUpdate()
  const onSaveAll = () => {
    const payload = rows.map((r, idx) => ({ id: r.id, order: idx }))
    if (!payload.length) return

    let done = 0
    const total = payload.length
    payload.forEach(({ id, order }) => {
      updateOne(
        { resource: resource?.name ?? 'departments', id, values: { order } },
        {
          onSettled: () => {
            done += 1
            if (done === total) {
              originalOrderRef.current = rows.map((r) => String(r.id))
              message.success('並び順を保存しました。')
            }
          },
        },
      )
    })
  }

  const columns: ColumnsType<RowVM> = [
    { dataIndex: 'id', title: t('departments.fields.id') },
    { dataIndex: 'name', title: t('departments.fields.name') },
    { dataIndex: 'code', title: t('departments.fields.code') },
    { dataIndex: 'created_by', title: t('departments.fields.created_by') },
    { dataIndex: 'updated_by', title: t('departments.fields.updated_by') },
    {
      dataIndex: 'created_at',
      title: t('departments.fields.created_at'),
      render: (value: any) => <DateField value={value} />,
    },
    {
      dataIndex: 'updated_at',
      title: t('departments.fields.updated_at'),
      render: (value: any) => <DateField value={value} />,
    },
    {
      dataIndex: 'number_of_employee',
      title: t('departments.fields.number_of_employee'),
    },
    {
      title: t('table.actions'),
      dataIndex: 'actions',
      render: (_: any, record: BaseRecord) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <ShowButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ]

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('departments.departments')}
        </Title>
      ),
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footer={
        <Col>
          <Button
            type="primary"
            onClick={onSaveAll}
            loading={savingAll}
            disabled={!isDirty}
          >
            {t('buttons.save_all', { defaultValue: '並び順を保存' })}
          </Button>
        </Col>
      }
    >
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="q">
              <Input
                placeholder={t('filters.searchPlaceholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
            <Space>
              <Button htmlType="submit" type="primary">
                {t('filters.search')}
              </Button>
              <Button onClick={() => searchFormProps.form?.resetFields()}>
                {t('filters.clear')}
              </Button>
            </Space>
          </Col>
          <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
            <CreateButton>{t('buttons.create_new')}</CreateButton>
          </Col>
        </Row>
      </Form>

      {/* TableDnd only for reordering; no inline edit */}
      <div className="mt-6">
        <TableDnd<RowVM>
          {...tableProps}
          dataSource={rows.map((r, i) => ({ ...r, __index: i }))}
          columns={columns}
          getRowId={(r) => getRowId(r)}
          onDragEnd={onDragEnd}
        />
      </div>
    </List>
  )
}
