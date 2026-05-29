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
import { Button, Input, message, Space, Typography, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { isString } from 'lodash'
import boldText from '@utility/bold-text'

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
  const [pageSize, setPageSize] = React.useState(20)
  const [lastRowEdited, setLastRowEdited] = React.useState<boolean>(false)
  const [totalPage, setTotalPage] = React.useState(0)
  const forceUpdate = useRef(false)
  const {
    tableProps,
    searchFormProps,
    setFilters,
    setPageSize: setPageSize2,
    current,
    setCurrent,
    pageCount,
    tableQueryResult: { isLoading, isFetching, refetch },
  } = useTable<TagRow>({
    pagination: { pageSize: 20 },
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'name_lk',
        operator: 'null',
        value: values?.name_lk,
      },
    ],
  })

  const { control, getValues, resetField, setValue, setError } =
    useForm<FormValues>({
      defaultValues: { rows: [] },
      mode: 'onTouched',
    })

  const { insert, remove, update, move, replace, fields, append } =
    useFieldArray({
      control,
      name: 'rows',
      keyName: '_key',
    })

  const watchedRows = useWatch({ control, name: 'rows' }) ?? []
  React.useEffect(() => {
    const targetIndex = pageSize - 1
    const targetRow = watchedRows[targetIndex]
    if (targetRow) {
      const isActive = !!(targetRow._isNew || targetRow._isEditing)
      setLastRowEdited(isActive)
    } else {
      setLastRowEdited(false)
    }
  }, [watchedRows, pageSize])

  const originalRef = useRef<Record<string, TagRow>>({})
  const originalOrderRef = useRef<TagRow[]>([])

  const keyOf = (row: TagRow, idx: number): string =>
    row.id?.toString() ?? row._key ?? `tmp-${idx}`

  useLayoutEffect(() => {
    if (forceUpdate.current) {
      setPageSize(20)
      setPageSize2(20)
    }
    const ds = (tableProps?.dataSource as TagRow[]) ?? []
    const normalizedData = ds.map((r) => ({
      _isNew: false,
      _isEditing: false,
      ...r,
    }))
    replace(normalizedData)
    originalOrderRef.current = normalizedData
    setEdited(false)
  }, [tableProps?.dataSource, current])

  const breadcrumbItems = [
    {
      title: boldText(t('system_config.system_config')),
    },
    {
      title: boldText(t('tags.tags'), PRIMARY),
    },
  ]

  const stashedRowRef = useRef<TagRow[]>([])
  const addNew = () => {
    setTotalPage(
      (pre) => (pre == 0 ? (tableProps?.pagination as any)?.total : pre) + 1,
    )
    forceUpdate.current = true
    const order = (getValues(`rows.0`)?.order ?? 0) + 1

    if (fields.length >= pageSize) {
      const lastIndex = fields.length - 1
      stashedRowRef.current.push(getValues(`rows.${lastIndex}`))
      remove(lastIndex)
    }

    insert(0, {
      name: '',
      _isNew: true,
      _isEditing: true,
      id: crypto?.randomUUID?.(),
      order,
    })
    setEdited(true)
  }

  const startEdit = (index: number) => {
    const current = getValues(`rows.${index}`)
    const stableKey = keyOf(current, index)
    originalRef.current[stableKey] = { ...current }
    update(index, { ...current, _isEditing: true })
    setEdited(true)
  }

  const cancelEdit = (index: number) => {
    const row = getValues(`rows.${index}`)
    if (row._isNew) {
      remove(index)
      setTotalPage(0)
      const rowToRestore = stashedRowRef.current.pop()
      if (rowToRestore) {
        append(rowToRestore)
      }
      checkIfEdited()
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
    checkIfEdited()
  }

  const { mutate: createRow } = useCreate({
    invalidates: [],
  })
  const { mutate: updateRow, isLoading: saving } = useUpdate({
    invalidates: [],
  })
  const { mutate: deleteRow } = useDelete()

  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()

  const [edited, setEdited] = useState<boolean>(false)

  const checkIfEdited = () => {
    const currentRows = getValues('rows') || []

    // check if there is any row being edited or new
    const hasEditingOrNew = currentRows.some((r) => r._isNew || r._isEditing)
    if (hasEditingOrNew) {
      setEdited(true)
      return
    }

    // check if the order has changed (compared to the original data from server)
    const originalIds = originalOrderRef.current
      .map((r) => r.id)
      .filter(Boolean)
    const currentIds = currentRows.map((r) => r.id).filter(Boolean)

    // if the length is different or the order is different
    if (originalIds.length !== currentIds.length) {
      setEdited(true)
      return
    }

    const orderChanged = originalIds.some((id, idx) => id !== currentIds[idx])
    setEdited(orderChanged)
  }

  const handleUpdateOrdering = (values: TagRow[]) => {
    updateAll({
      url: `${apiUrl}/${resource?.name}/upsert`,
      method: 'post',
      values,
      successNotification: () => {
        stashedRowRef.current = []
        setTotalPage(0)
        refetch()
        setEdited(false)
        return {
          message: t('notifications.success'),
          description: t('notifications.success'),
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
        _isNew: false,
      }))

    if (!values.length) return
    handleUpdateOrdering(values as TagRow[])
  }

  const saveRow = (index: number) => {
    const row = getValues(`rows.${index}`)
    const order = getValues(`rows.0`)?.order ?? index
    const name = (row.name ?? '').trim()
    if (!name) {
      setError(`rows.${index}.name`, {
        message: '',
      })
      return
    }

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
            setTimeout(() => {
              const updatedRows = getValues('rows')
              originalOrderRef.current = updatedRows
              checkIfEdited()
            }, 0)
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
            setTimeout(() => {
              const updatedRows = getValues('rows')
              originalOrderRef.current = updatedRows
              checkIfEdited()
            }, 0)
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

  const dataSource: RowVM[] = useMemo(() => {
    return (watchedRows as TagRow[])
      .map((r, i) => ({ ...r, __index: String(i) }))
      .filter((r) => r.id || r.order)
  }, [watchedRows])

  React.useEffect(() => {
    // 1. Nếu đang load data thì KHÔNG làm gì cả để tránh tính toán sai lúc total = 0
    if (isLoading || isFetching || !tableProps?.pagination) {
      return
    }

    const total = (tableProps.pagination as any)?.total || 0
    const currentSize =
      pageSize || (tableProps.pagination as any)?.pageSize || 20

    // 2. Tính toán trang cuối cùng thực tế
    // Ví dụ: Total = 41, size = 20 -> Last page = 5
    const lastPage = Math.ceil(total / currentSize)

    // 3. Chỉ nhảy trang nếu:
    // - Có dữ liệu (total > 0)
    // - Trang hiện tại (current) lớn hơn trang cuối cùng thực tế (lastPage)
    if (total > 0 && current > lastPage) {
      const targetPage = Math.max(1, lastPage)

      setCurrent(targetPage)

      message.warning(t('tags.no_data_on_page'))
    }
  }, [
    current,
    tableProps?.pagination,
    pageSize,
    isLoading,
    isFetching,
    setCurrent,
    t,
  ])

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
      setTimeout(() => checkIfEdited(), 0)
    }
  }

  const columns: ColumnsType<RowVM> = [
    {
      title: 'タグ名',
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const },
      }),
      onCell: () => ({
        style: { textAlign: 'left' as const },
      }),
      render: (_val, record, index) => {
        const isEditing = (watchedRows[index] as TagRow | undefined)?._isEditing
        return isEditing ? (
          <Controller
            control={control}
            rules={{ required: true }}
            name={`rows.${index}.name`}
            render={({ field, fieldState: { error } }) => (
              <div className={'-mb-2 !h-fit'}>
                <Input
                  required
                  size="middle"
                  placeholder={t('product_units.columns.unit_name')}
                  status={error ? 'error' : ''}
                  autoFocus={true}
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
          <Typography.Text style={{ textAlign: 'left', display: 'block' }}>
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
                  autoInsertSpace={false}
                >
                  {t('buttons.save')}
                </Button>
                <Button
                  size="middle"
                  onClick={() => cancelEdit(index)}
                  autoInsertSpace={false}
                >
                  {t('buttons.cancel')}
                </Button>
              </>
            ) : (
              <>
                <EditButton
                  autoInsertSpace={false}
                  size="small"
                  icon={null}
                  resource="tags"
                  onClick={() => startEdit(index)}
                  style={{
                    color: '#FFFFFF',
                    background: '#1FDB51',
                  }}
                >
                  {t('buttons.edit')}
                </EditButton>
                <DeleteButton
                  autoInsertSpace={false}
                  size="small"
                  icon={null}
                  resource="tags"
                  recordItemId={dataSource[index]?.id}
                  onClick={() =>
                    !dataSource[index]?.id && handleDeleteRow(index)
                  }
                  style={{
                    color: '#FFFFFF',
                    background: '#E74C3C',
                  }}
                >
                  {t('buttons.delete')}
                </DeleteButton>
              </>
            )}
          </Space>
        )
      },
    },
  ]

  const isDirty = useMemo(() => {
    return watchedRows.some((r) => r._isNew || r._isEditing)
  }, [watchedRows])

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any,
  ) => {
    if (isDirty) {
      Modal.confirm({
        title: t('tags.confirm_navigation'),
        content: t('tags.unsaved_changes_warning'),
        okText: t('buttons.confirm'),
        cancelText: t('buttons.cancel'),
        type: 'warning',
        onOk: () => {
          stashedRowRef.current = []
          tableProps.onChange?.(pagination, filters, sorter, extra)
        },
        onCancel: () => {},
      })
    } else {
      tableProps.onChange?.(pagination, filters, sorter, extra)
    }
  }

  return {
    t,
    breadcrumbItems,
    addNew,
    columns,
    dataSource,
    lastRowEdited,
    onDragEnd,
    onSaveAll,
    savingAll,
    searchFormProps,
    tableProps: {
      ...tableProps,
      onChange: handleTableChange,
      pagination: {
        ...tableProps?.pagination,
        pageSize,
        onShowSizeChange: (current: number, size: number) => {
          setPageSize(size)
        },
        total:
          totalPage === 0 ? (tableProps.pagination as any)?.total : totalPage,
      },
    },
    getRowIdForDnd,
    setFilters,
    edited,
  }
}

export default useTags
