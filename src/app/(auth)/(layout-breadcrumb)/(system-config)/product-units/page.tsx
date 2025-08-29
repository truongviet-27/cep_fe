'use client'

import { RightOutlined } from '@ant-design/icons'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, EditButton, useTable } from '@refinedev/antd'
import {
  useApiUrl,
  useCreate,
  useCustomMutation,
  useDelete,
  useResource,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Switch, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

const { Title } = Typography

export type UnitRow = {
  id?: number | string
  name: string
  isActive: boolean
  order: number
  _isNew?: boolean
  _isEditing?: boolean
  _key?: string
}

type FormValues = { rows: UnitRow[] }

type RowVM = UnitRow & { __index: string }

export default function Page() {
  const t = useTranslate()
  const { resource } = useResource()
  const { tableProps, searchFormProps } = useTable<UnitRow>({
    syncWithLocation: true,
  })

  const apiUrl = useApiUrl()

  const { control, getValues, resetField } = useForm<FormValues>({
    defaultValues: { rows: [] },
  })

  const { insert, remove, update, move, replace, fields } = useFieldArray({
    control,
    name: 'rows',
    keyName: '_key',
  })

  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()

  const handleUpdateOrdering = (
    values: { id: string | number; order: number }[],
  ) => {
    updateAll({
      url: `${apiUrl}/${resource?.name}/upsert`,
      method: 'post',
      values: { data: values },
    })
  }

  const watchedRows = useWatch({ control, name: 'rows' }) ?? []

  const onSaveAll = () => {
    const list = fields.map((_, idx) => watchedRows[idx] ?? {}) as UnitRow[]

    const maxOrder = list.reduce((max, r) => Math.max(max, r?.order ?? 0), 0)

    const values = list
      .filter((r) => r?.id != null)
      .map((r, index) => ({
        id: r.id as string | number,
        order: maxOrder - index,
      }))

    if (!values.length) return
    handleUpdateOrdering(values)
  }

  const originalRef = useRef<Record<string, UnitRow>>({})

  const keyOf = (row: UnitRow, idx: number): string =>
    row.id?.toString() ?? row._key ?? `tmp-${idx}`

  useEffect(() => {
    const ds = (tableProps?.dataSource as UnitRow[]) ?? []
    // server rows come in as read-only
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
      title: <Title level={5}>{t('product_units.product_units')}</Title>,
    },
  ]

  const addNew = () => {
    const order = fields?.[1]?.order ?? 0
    insert(
      0,
      {
        id: crypto?.randomUUID?.(),
        name: '',
        order,
        isActive: true,
        _isNew: true,
        _isEditing: true,
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
      resetField(`rows.${index}.isActive`)
      update(index, { ...row, _isEditing: false })
    }
    delete originalRef.current[stableKey]
  }

  const { mutate: createRow } = useCreate()
  const { mutate: updateRow, isLoading: saving } = useUpdate()
  const { mutate: deleteRow } = useDelete()

  const saveRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    const name = (row.name ?? '').trim()
    const isActive = !!row.isActive
    const order = (fields?.[1]?.order ?? 0) + 1
    if (!name) return

    if (row._isNew) {
      createRow(
        { resource: resource?.name, values: { name, isActive, order } },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: data?.id ?? row.id,
              order,
              name,
              isActive,
              _isNew: false,
              _isEditing: false,
            })
            const stableKey = keyOf(row, index)
            delete originalRef.current[stableKey]
          },
        },
      )
    } else if (row.id) {
      updateRow(
        {
          resource: resource?.name,
          id: row.id,
          values: { name, isActive, order },
        },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: data?.id ?? row.id,
              name,
              order,
              isActive,
              _isNew: false,
              _isEditing: false,
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
      { resource: resource?.name ?? 'product-units', id: row.id },
      { onSuccess: () => remove(index) },
    )
  }

  const dataSource: RowVM[] = useMemo(
    () =>
      fields.map((_, i) => {
        const v = (watchedRows[i] as UnitRow | undefined) ?? ({} as UnitRow)
        return { ...v, __index: String(i) } as RowVM
      }),
    [fields, watchedRows],
  )

  const getRowIdForDnd = (r: RowVM): string => {
    const idx = Number(r.__index)
    return fields[idx]?._key as string
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
      title: '単位名',
      dataIndex: 'name',
      key: 'name',
      render: (_v, record) => {
        const index = Number(record.__index)
        const isEditing = (watchedRows[index] as UnitRow | undefined)
          ?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            name={`rows.${index}.name`}
            render={({ field }) => (
              <Input {...field} size="middle" autoFocus placeholder="単位名" />
            )}
          />
        ) : (
          <Typography.Text>
            {(watchedRows[index] as UnitRow | undefined)?.name}
          </Typography.Text>
        )
      },
    },
    {
      title: '有効・無効',
      key: 'isActive',
      width: 240,
      render: (_v, record) => {
        const index = Number(record.__index)
        const isEditing = (watchedRows[index] as UnitRow | undefined)
          ?._isEditing
        const value =
          (watchedRows[index] as UnitRow | undefined)?.isActive ?? true
        return isEditing ? (
          <Controller
            control={control}
            name={`rows.${index}.isActive`}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} />
            )}
          />
        ) : (
          <Switch checked={value} disabled />
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 300,
      render: (_v, record) => {
        const index = Number(record.__index)
        const isEditing = (watchedRows[index] as UnitRow | undefined)
          ?._isEditing
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
                  size="middle"
                  onClick={() => startEdit(index)}
                  hideText
                />
                <DeleteButton
                  hideText
                  size="middle"
                  recordItemId={dataSource[index]?.id}
                  onClick={() =>
                    !dataSource[index]?.id && handleDeleteRow(index)
                  }
                />
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
      footer={
        <Col>
          <Button
            type="primary"
            onClick={onSaveAll}
            loading={savingAll}
            disabled={savingAll}
          >
            {t('buttons.save_all', { defaultValue: '並び順を保存' })}
          </Button>
        </Col>
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
                  <Button htmlType="reset" size="middle" type="default">
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

      <div className="mt-8">
        <TableDnd<RowVM>
          {...tableProps}
          dataSource={dataSource}
          columns={columns}
          getRowId={getRowIdForDnd}
          onDragEnd={onDragEnd}
        />
      </div>
    </List>
  )
}
