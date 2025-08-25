'use client'

import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, EditButton, useTable } from '@refinedev/antd'
import {
  useCreate,
  useDelete,
  useResource,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useId, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

const { Title } = Typography

type TagRow = {
  id?: number
  name: string
  _isNew?: boolean
  _isEditing?: boolean
  __index: string
}

type FormValues = { rows: TagRow[] }

const Page = () => {
  const t = useTranslate()
  const { resource } = useResource()
  const { tableProps, searchFormProps } = useTable<TagRow>({
    syncWithLocation: true,
  })

  const __index = useId()

  const { mutate: updateRow, isLoading: saving } = useUpdate()
  const { mutate: createRow } = useCreate()
  const { mutate: deleteRow } = useDelete()

  const { control, getValues, resetField } = useForm<FormValues>({
    defaultValues: { rows: [] },
  })

  const { append, remove, update, replace } = useFieldArray({
    control,
    name: 'rows',
  })

  const watchedRows = useWatch({ control, name: 'rows' }) ?? []

  useEffect(() => {
    const ds = (tableProps?.dataSource as TagRow[]) ?? []
    replace(ds.map((r) => ({ ...r, _isNew: false, _isEditing: false })))
  }, [tableProps?.dataSource, replace])

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

  // Lưu snapshot để hoàn tác khi cancel
  const originalRef = useRef<Record<number, TagRow>>({})

  const addNew = () => {
    append({ name: '', _isNew: true, _isEditing: true, __index })
  }

  const startEdit = (index: number) => {
    const current = getValues(`rows.${index}`)
    originalRef.current[index] = { ...current }
    update(index, { ...current, _isEditing: true })
  }

  const cancelEdit = (index: number) => {
    const row = getValues(`rows.${index}`)
    if (row._isNew) {
      remove(index)
    } else {
      const orig = originalRef.current[index]
      if (orig) {
        update(index, { ...orig, _isNew: false, _isEditing: false })
      } else {
        // fallback nếu thiếu snapshot
        resetField(`rows.${index}.name`)
        update(index, { ...row, _isEditing: false })
      }
    }
    delete originalRef.current[index]
  }

  const saveRow = async (index: number) => {
    const row = getValues(`rows.${index}`)
    const name = (row.name ?? '').trim()
    if (!name) return

    if (row._isNew) {
      createRow(
        { resource: resource?.name, values: { name } },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: Number(data?.id),
              name,
              _isNew: false,
              _isEditing: false,
              __index,
            })
            delete originalRef.current[index]
          },
        },
      )
    } else if (row.id) {
      updateRow(
        { resource: resource?.name, id: row.id, values: { name } },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: Number(data?.id ?? row.id),
              name,
              _isNew: false,
              _isEditing: false,
              __index,
            })
            delete originalRef.current[index]
          },
        },
      )
    }
  }

  const handleDeleteRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    if (row._isNew || !row.id) {
      remove(index)
      return
    }
    deleteRow(
      { resource: resource?.name ?? 'tags', id: row.id },
      { onSuccess: () => remove(index) },
    )
  }

  const dataSource = useMemo(
    () => watchedRows.map((r, i) => ({ ...r, __index: String(i) })),
    [watchedRows],
  )

  const columns: ColumnsType<(typeof dataSource)[number]> = [
    {
      title: 'タグ名',
      dataIndex: 'name',
      key: 'name',
      render: (_val, record) => {
        const index = Number(record.__index)
        const isEditing = watchedRows[index]?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            name={`rows.${index}.name`}
            render={({ field }) => (
              <Input {...field} size="middle" autoFocus placeholder="タグ名" />
            )}
          />
        ) : (
          <Typography.Text>{watchedRows[index]?.name}</Typography.Text>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 300,
      render: (_val, record) => {
        const index = Number(record.__index)
        const isEditing = watchedRows[index]?._isEditing
        return (
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  size="middle"
                  loading={saving}
                  onClick={() => saveRow(index)}
                >
                  保存
                </Button>
                <Button size="middle" onClick={() => cancelEdit(index)}>
                  キャンセル
                </Button>
              </>
            ) : (
              <>
                <EditButton
                  icon={null}
                  size="middle"
                  onClick={() => startEdit(index)}
                >
                  編集
                </EditButton>
                <DeleteButton
                  size="middle"
                  icon={null}
                  recordItemId={record.id}
                  onClick={() => !record?.id && handleDeleteRow(index)}
                >
                  削除
                </DeleteButton>
              </>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form {...searchFormProps} layout="vertical" colon={false}>
        <Row
          align="middle"
          justify="space-between"
          wrap={false}
          gutter={[16, 16]}
          style={{ width: '100%' }}
        >
          <Col flex="auto">
            <Row align="middle" gutter={16} wrap={false}>
              <Col>
                <div style={{ fontWeight: 600 }}>単位名</div>
              </Col>
              <Col flex="360px">
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input placeholder="部分一致" allowClear size="middle" />
                </Form.Item>
              </Col>
              <Col>
                <Space size="middle">
                  <Button htmlType="submit" type="primary" size="middle">
                    検索
                  </Button>
                  <Button size="middle" type="default">
                    クリア
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type="primary" size="middle" onClick={addNew}>
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      <CommonTable
        className="mt-8"
        {...tableProps}
        rowKey={(r) => r.id ?? r.__index}
        columns={columns}
        dataSource={dataSource}
      />
    </List>
  )
}

export default Page
