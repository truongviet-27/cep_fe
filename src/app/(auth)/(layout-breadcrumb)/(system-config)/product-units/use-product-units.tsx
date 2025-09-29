/* eslint-disable */
'use client'

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
import { PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { PRIMARY } from '@utility/color'
import { Button, Input, Space, Switch, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { isString } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

const { Title } = Typography

export type UnitRow = {
  id?: number | string
  name: string
  is_disable: boolean
  order: number
  _isNew?: boolean
  _isEditing?: boolean
  _key?: string
}

type FormValues = { rows: UnitRow[] }

export type RowVM = UnitRow & { __index: string }
const EditableNameCell = React.memo(
  ({ control, index, t }: { control: any; index: number; t: any }) => {
    const isEditing = useWatch({ control, name: `rows.${index}._isEditing` })
    const nameValue = useWatch({ control, name: `rows.${index}.name` })

    return isEditing ? (
      <Controller
        control={control}
        name={`rows.${index}.name`}
        rules={{ required: t('validation.required') }}
        render={({ field, fieldState: { error } }) => (
          <div className={'-mb-2 !h-fit'}>
            <Input
              {...field}
              required
              size="middle"
              placeholder={t('product_units.columns.unit_name')}
              status={error ? 'error' : ''}
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
      <Typography.Text>{nameValue}</Typography.Text>
    )
  },
)

function useProductUnits() {
  const t = useTranslate()
  const { resource } = useResource()
  const { hasFullAccessModule } = useUserStore.getState()

  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_UNIT_EDIT)
  const { tableProps, searchFormProps, setFilters, current, setPageSize } =
    useTable<UnitRow>({
      syncWithLocation: true,
      onSearch: (values: any) => {
        if (values.name_lk) {
          return [
            {
              field: 'name_lk',
              value: values.name_lk,
              operator: 'null',
            },
          ]
        }
        return []
      },
    })

  const apiUrl = useApiUrl()

  const { control, getValues, resetField, setFocus } = useForm<FormValues>({
    defaultValues: { rows: [{ name: '', is_disable: true, order: 0 }] },
    mode: 'onTouched',
  })

  const { insert, remove, update, move, replace, fields } = useFieldArray({
    control,
    name: 'rows',
    keyName: '_key',
  })

  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()

  const handleUpdateOrdering = (values: UnitRow[]) => {
    updateAll({
      url: `${apiUrl}/${resource?.name}/upsert`,
      method: 'post',
      values,
      successNotification: (data) => {
        return {
          message: t('notifications.editSuccess'),
          description: t('notifications.editSuccess'),
          type: 'success',
        }
      },
    })
  }

  const watchedRows = useWatch({ control, name: 'rows' }) ?? []

  const onSaveAll = () => {
    const list = fields.map((_, idx) => watchedRows[idx] ?? {}) as UnitRow[]

    const maxOrder = list.reduce((max, r) => Math.max(max, r?.order ?? 0), 0)

    const values = list
      .filter((r) => r?.id != null)
      .map((r, index) => ({
        ...r,
        id: isString(r.id) ? null : r.id,
        order: maxOrder - index,
      }))

    if (!values.length) return
    handleUpdateOrdering(values as UnitRow[])
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
        is_disable: false,
        _isNew: true,
        _isEditing: true,
      },
      { focusIndex: 0 },
    )
    setTimeout(() => setFocus(`rows.0.name`), 0)
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
      resetField(`rows.${index}.is_disable`)
      update(index, { ...row, _isEditing: false })
    }
    delete originalRef.current[stableKey]
  }

  console.log('rendered')

  const { mutate: createRow } = useCreate()
  const { mutate: updateRow, isLoading: saving } = useUpdate()
  const { mutate: deleteRow } = useDelete()

  const saveRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    const name = (row.name ?? '').trim()
    const is_disable = !!row.is_disable
    const order = (fields?.[1]?.order ?? 0) + 1
    if (!name) return

    if (row._isNew) {
      createRow(
        { resource: resource?.name, values: { name, is_disable, order } }, // Sửa tên field
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: data?.id ?? row.id,
              order,
              name,
              is_disable,
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
          values: { name, is_disable, order },
        },
        {
          onSuccess: ({ data }) => {
            update(index, {
              id: data?.id ?? row.id,
              name,
              order,
              is_disable,
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
      render: (_v, _record, index) => (
        <EditableNameCell control={control} index={index} t={t} />
      ),
    },
    {
      title: '有効・無効',
      key: 'is_disable',
      width: 240,
      render: (_v, record, index) => {
        return (
          <Controller
            control={control}
            name={`rows.${index}.is_disable`}
            render={({ field }) => (
              <Switch
                {...field}
                checked={!field.value}
                onChange={(checked) => field.onChange(!checked)}
              />
            )}
          />
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

  return {
    t,
    breadcrumbItems,
    addNew,
    saveAll: onSaveAll,
    columns,
    dataSource,
    tableProps,
    searchFormProps,
    savingAll,
    saving,
    isFullAccess,
    getRowIdForDnd,
    onDragEnd,
    setFilters,
  }
}

export default useProductUnits
