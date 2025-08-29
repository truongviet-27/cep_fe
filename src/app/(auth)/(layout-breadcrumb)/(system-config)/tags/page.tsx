'use client'

import { RightOutlined } from '@ant-design/icons'
import TableDnd from '@components/common/table-dnd'
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
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

const { Title } = Typography

export type TagRow = {
  id?: number | string
  name: string
  order: number
  _isNew?: boolean
  _isEditing?: boolean
  _key?: string
}

type FormValues = { rows: TagRow[] }

type RowVM = TagRow & { __index: string }

export default function Page() {
  const t = useTranslate()
  const { resource } = useResource()
  const { tableProps, searchFormProps } = useTable<TagRow>({
    syncWithLocation: true,
  })

  const { control, getValues, resetField } = useForm<FormValues>({
    defaultValues: { rows: [] },
  })

  const { insert, remove, update, move, replace } = useFieldArray({
    control,
    name: 'rows',
    keyName: '_key',
  })

  const watchedRows = useWatch({ control, name: 'rows' }) ?? []

  const originalRef = useRef<Record<string, TagRow>>({})

  const keyOf = (row: TagRow, idx: number): string =>
    row.id?.toString() ?? row._key ?? `tmp-${idx}`

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

  const addNew = () => {
    const order = getValues(`rows.0`)?.order ?? 0
    insert(
      0,
      {
        name: '',
        _isNew: true,
        _isEditing: true,
        id: crypto?.randomUUID?.(),
        order,
      },
      { shouldFocus: true },
    )
  }

  const startEdit = (index: number) => {
    const current = getValues(`rows.${index}`)
    const stableKey = keyOf(current, index)
    originalRef.current[stableKey] = { ...current }
    update(index, { ...current, _isEditing: true })
  }

  const cancelEdit = (index: number) => {
    const row = getValues(`rows.${index}`)
    if (row._isNew) {
      remove(index)
      return
    }
    const stableKey = keyOf(row, index)
    const orig = originalRef.current[stableKey]
    if (orig) {
      update(index, { ...orig, _isNew: false, _isEditing: false })
    } else {
      resetField(`rows.${index}.name`)
      update(index, { ...row, _isEditing: false })
    }
    delete originalRef.current[stableKey]
  }

  const { mutate: createRow } = useCreate()
  const { mutate: updateRow, isLoading: saving } = useUpdate()
  const { mutate: deleteRow } = useDelete()

  const saveRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    const order = getValues(`rows.0`)?.order ?? index
    const name = (row.name ?? '').trim()
    if (!name) return

    if (row._isNew) {
      createRow(
        { resource: resource?.name, values: { name, order: order } },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: Number(data?.id),
              name,
              _isNew: false,
              _isEditing: false,
              order,
            })
            const stableKey = keyOf(row, index)
            delete originalRef.current[stableKey]
          },
        },
      )
    } else if (row.id) {
      updateRow(
        { resource: resource?.name, id: row.id, values: { name, index } },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: Number(data?.id ?? row.id),
              name,
              _isNew: false,
              _isEditing: false,
              order,
            })
            const stableKey = keyOf(row, index)
            delete originalRef.current[stableKey]
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

  const dataSource: RowVM[] = useMemo(
    () =>
      (watchedRows as TagRow[]).map((r, i) => ({ ...r, __index: String(i) })),
    [watchedRows],
  )

  const getRowIdForDnd = (r: RowVM): string => {
    const idx = Number(r.__index)
    return keyOf(watchedRows[idx] as TagRow, idx)
  }

  const onDragEnd = (activeId: string, overId: string | null) => {
    if (!overId) return
    const findIndexById = (id: string): number =>
      dataSource.findIndex((r) => getRowIdForDnd(r) === id)

    const from = findIndexById(activeId)
    const to = findIndexById(overId)
    if (from !== -1 && to !== -1 && from !== to) {
      move(from, to)
    }
  }

  const columns: ColumnsType<RowVM> = [
    {
      title: 'タグ名',
      dataIndex: 'name',
      key: 'name',
      render: (_val, record) => {
        const index = Number(record.__index)
        const isEditing = (watchedRows[index] as TagRow | undefined)?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            name={`rows.${index}.name`}
            render={({ field }) => (
              <Input {...field} size="middle" autoFocus placeholder="タグ名" />
            )}
          />
        ) : (
          <Typography.Text>
            {(watchedRows[index] as TagRow | undefined)?.name}
          </Typography.Text>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 300,
      render: (_val, record) => {
        const index = Number(record.__index)
        const isEditing = (watchedRows[index] as TagRow | undefined)?._isEditing
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
                  recordItemId={dataSource[index]?.id}
                  onClick={() =>
                    !dataSource[index]?.id && handleDeleteRow(index)
                  }
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

      {/* Replaced CommonTable with TableDnd */}
      <div className="mt-8">
        <TableDnd<RowVM>
          dataSource={dataSource}
          columns={columns}
          getRowId={getRowIdForDnd}
          onDragEnd={onDragEnd}
          tableProps={{}}
        />
      </div>
    </List>
  )
}
