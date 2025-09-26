/* eslint-disable */
'use client'

import type { UnitRow } from '@app/(auth)/(layout-breadcrumb)/(system-config)/product-units/use-product-units'
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
import { Button, Input, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { isString } from 'lodash'

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

function useTags() {
  const t = useTranslate()
  const { resource } = useResource()
  const apiUrl = useApiUrl()
  const { tableProps, searchFormProps, setFilters } = useTable<TagRow>({
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'name_lk',
        operator: 'null',
        value: values?.name_lk,
      },
    ],
  })

  const { control, getValues, resetField, setValue, setFocus } =
    useForm<FormValues>({
      defaultValues: { rows: [] },
      mode: 'onTouched',
    })

  const { insert, remove, update, move, replace, fields } = useFieldArray({
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
      title: <Title level={5}>{t('tags.tags')}</Title>,
    },
  ]

  const addNew = () => {
    const order = (getValues(`rows.0`)?.order ?? 0) + 1
    insert(0, {
      name: '',
      _isNew: true,
      _isEditing: true,
      id: crypto?.randomUUID?.(),
      order,
    })
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

  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()
  const handleUpdateOrdering = (values: TagRow[]) => {
    updateAll({
      url: `${apiUrl}/${resource?.name}/upsert`,
      method: 'post',
      values,
      successNotification: (data) => {
        setValue('rows', values as any)
        return {
          message: t('notifications.success'),
          description: data?.data?.message ?? 'Success',
          type: 'success',
        }
      },
    })
  }

  const onSaveAll = () => {
    const list = fields.map((_, idx) => watchedRows[idx] ?? {}) as UnitRow[]

    const maxOrder = list.reduce((max, r) => Math.max(max, r?.order ?? 0), 0)

    const values = list
      .filter((r) => r?.id != null)
      .map((r, index) => ({
        ...r,
        id: isString(r.id) ? null : r.id,
        order: maxOrder - index,
        _isEditing: false,
      }))

    if (!values.length) return
    handleUpdateOrdering(values as TagRow[])
  }

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
      render: (_val, record, index) => {
        const isEditing = (watchedRows[index] as TagRow | undefined)?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            rules={{ required: t('validation.required') }}
            name={`rows.${index}.name`}
            render={({ field, fieldState: { error } }) => (
              <div className={'-mb-2 !h-fit'}>
                <Input
                  required
                  size="middle"
                  placeholder={t('product_units.columns.unit_name')}
                  status={error ? 'error' : ''}
                  {...field}
                />
                {error?.message && (
                  <p className="!h-2 text-[0.7rem] text-red-600">
                    {error?.message}
                  </p>
                )}
              </div>
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
                  hideText
                  size="middle"
                  onClick={() => startEdit(index)}
                />
                <DeleteButton
                  size="middle"
                  hideText
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

  return {
    t,
    breadcrumbItems,
    addNew,
    columns,
    dataSource,
    onDragEnd,
    onSaveAll,
    savingAll,
    searchFormProps,
    tableProps,
    getRowIdForDnd,
    setFilters,
  }
}

export default useTags
