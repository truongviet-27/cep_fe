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
  RefreshButton,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import {
  BaseRecord,
  useApiUrl,
  useCustomMutation,
  useResource,
  useTranslate,
} from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Department } from '@sdk/hey-api'

const { Title, Text } = Typography

type RowVM = Department & { __index: number }

export default function Page() {
  const t = useTranslate()
  const { resource } = useResource()

  const { tableProps, searchFormProps, setFilters } = useTable<Department>({
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'contains',
        value: values?.q,
      },
    ],
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

  const apiUrl = useApiUrl()
  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()

  const handleUpdateOrdering = (
    values: {
      id?: string | number
      order: number
    }[],
  ) => {
    updateAll({
      url: `${apiUrl}/${resource?.name}/ordering`,
      method: 'post',
      values: { data: values },
    })
  }

  const onSaveAll = () => {
    const maxOrder = rows.reduce((max, r) => Math.max(max, r.order ?? 0), 0)

    const values = rows.map((r, index) => ({
      id: r.id,
      order: maxOrder - index,
    }))
    if (!values.length) return

    handleUpdateOrdering(values)
  }

  const columns: ColumnsType<RowVM> = [
    { dataIndex: 'code', title: t('departments.fields.code') },
    { dataIndex: 'name', title: t('departments.fields.name') },
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
      title: t('table.actions'),
      dataIndex: 'actions',
      render: (_: any, record: BaseRecord) => (
        <Space>
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
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
    {
      title: <Title level={5}>{t('departments.list.list')}</Title>,
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={t('departments.list.list')}
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
            <Text strong>{t('departments.list.filters.search_label')}</Text>
            <Form.Item name="q">
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
            <Space className={'mt-[30px]'}>
              <Button htmlType="submit" type="primary">
                {t('buttons.search')}
              </Button>
              <RefreshButton
                size="middle"
                icon={null}
                onClick={() => {
                  searchFormProps.form?.resetFields()
                  setFilters([], 'replace')
                }}
              >
                {t('buttons.clear')}
              </RefreshButton>
            </Space>
          </Col>
          <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
            <div className={'h-[32px]'} />
            <CreateButton icon={null}>{t('buttons.create_new')}</CreateButton>
          </Col>
        </Row>
      </Form>

      <div className="mt-6">
        <TableDnd<RowVM>
          tableProps={tableProps}
          dataSource={rows.map((r, i) => ({ ...r, __index: i }))}
          columns={columns}
          getRowId={(r) => getRowId(r)}
          onDragEnd={onDragEnd}
        />
      </div>
    </List>
  )
}
