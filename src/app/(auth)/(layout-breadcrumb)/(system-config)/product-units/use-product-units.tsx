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
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Input, Space, Switch, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { isString } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { TagRow } from '@app/(auth)/(layout-breadcrumb)/(system-config)/tags/use-tags'

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
export type RowVM = UnitRow & { __index: string }

type FormValues = { rows: UnitRow[] }

export default function useProductUnits() {
  const t = useTranslate()
  const { resource } = useResource()
  const { hasFullAccessModule } = useUserStore.getState()
  const [pageSize, setPageSize] = React.useState(10)
  const [totalPage, setTotalPage] = React.useState(0)
  const forceUpdate = useRef(false)
  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_UNIT_EDIT)
  const {
    tableProps,
    searchFormProps,
    setFilters,
    setPageSize: setPageSize2,
    current,
    pageCount,
    tableQuery,
  } = useTable<UnitRow>({
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

  const { control, getValues, resetField, reset, setError } =
    useForm<FormValues>({
      defaultValues: { rows: [{ name: '', is_disable: true, order: 0 }] },
      mode: 'onTouched',
    })

  const { remove, update, move, fields, insert } = useFieldArray({
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
        reset({
          rows: values.map((r, index) => ({
            ...r,
            name: watchedRows?.[index]?.name,
            _isNew: false,
            _isEditing: false,
            __index: String(index),
          })),
        })

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
  const preserveNewRowsRef = useRef<
    Array<{ row: UnitRow; originalIndex: number }>
  >([])

  const keyOf = (row: TagRow, idx: number): string =>
    row.id?.toString() ?? row._key ?? `tmp-${idx}`

  useEffect(() => {
    if (forceUpdate.current) {
      setPageSize(10)
      setPageSize2(10)
    }
    const ds = (tableProps?.dataSource as UnitRow[]) ?? []
    const rowsToSet = ds.map((r, index) => ({
      _isNew: false,
      _isEditing: false,
      __index: String(index),
      ...r,
    }))

    if (preserveNewRowsRef.current.length > 0) {
      const sortedPreserved = [...preserveNewRowsRef.current].sort(
        (a, b) => a.originalIndex - b.originalIndex,
      )

      sortedPreserved.forEach(({ row: newRow, originalIndex }) => {
        const insertIndex = Math.min(originalIndex, rowsToSet.length)
        rowsToSet.splice(insertIndex, 0, {
          ...newRow,
          _isNew: newRow._isNew ?? false,
          _isEditing: newRow._isEditing ?? false,
          __index: String(insertIndex),
        })
      })

      preserveNewRowsRef.current = []
    }

    reset({ rows: rowsToSet })
  }, [tableProps?.dataSource, current])

  const breadcrumbItems = [
    {
      title: boldText(t('system_config.system_config')),
    },
    {
      title: boldText(t('product_units.product_units'), PRIMARY),
    },
  ]

  const addNew = () => {
    // setPageSize((total) => total + 1)
    // setTotalPage((pre) =>
    //   pre == 0 ? (tableProps?.pagination as any)?.total : pre,
    // )
    forceUpdate.current = true
    const order = (getValues(`rows.0`)?.order ?? 0) + 1

    insert(0, {
      id: crypto?.randomUUID?.(),
      name: '',
      order,
      is_disable: false,
      _isNew: true,
      _isEditing: true,
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
    if (row?._isNew) {
      remove(index)
      setPageSize((total) => total - 1)
      return
    }
    const stableKey = keyOf(row, index)
    const orig = originalRef.current[stableKey]
    if (orig) {
      update(index, {
        ...orig,
        _isNew: false,
        _isEditing: false,
      })
    } else {
      resetField(`rows.${index}.name`)
      resetField(`rows.${index}.is_disable`)
      update(index, { ...row, _isEditing: false })
    }
    delete originalRef.current[stableKey]
  }

  const { mutate: createRow } = useCreate({
    invalidates: [],
  })
  const { mutate: updateRow, isLoading: saving } = useUpdate({
    invalidates: [],
  })
  const { mutate: deleteRow } = useDelete()

  const saveRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    const name = (row.name ?? '').trim()
    const is_disable = !!row.is_disable
    const order = row.order ?? 0

    if (!name) {
      setError(`rows.${index}.name`, {
        message: '',
      })
      return
    }

    if (row._isNew) {
      createRow(
        { resource: resource?.name, values: { name, is_disable, order } },
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
      {
        onSuccess: () => {
          remove(index)
          tableQuery.refetch()
        },
      },
    )
  }

  const dataSource: RowVM[] = useMemo(
    () =>
      (watchedRows as UnitRow[]).map((r, i) => ({ ...r, __index: String(i) })),
    [watchedRows],
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
      align: 'left',
      render: (_val, record, index) => {
        const isEditing = (watchedRows[index] as TagRow | undefined)?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            rules={{ required: '' }}
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
                disabled={!fields?.[index]?._isEditing}
                style={{ opacity: fields?.[index]?._isEditing ? 1 : 0.3 }}
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
                  // onClick={() =>
                  //   !dataSource[index]?.id && handleDeleteRow(index)
                  // }
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
    tableProps: {
      ...tableProps,
      pagination: {
        ...tableProps?.pagination,
        // pageSize,
        onShowSizeChange: (current: number, size: number) => {
          setPageSize(size)
        },
        // total:
        //   totalPage === 0 ? (tableProps.pagination as any)?.total : totalPage,
      },
    },
    searchFormProps,
    savingAll,
    saving,
    isFullAccess,
    getRowIdForDnd,
    onDragEnd,
    setFilters,
  }
}
