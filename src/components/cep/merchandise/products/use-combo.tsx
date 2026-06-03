/* eslint-disable @typescript-eslint/no-explicit-any */

import { PictureOutlined } from '@ant-design/icons'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { CrudFilters, HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PermissionEnum, type ProductListItem } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo } from 'react'

interface ISearch {
  search: string
  category_id: string
  is_sent_to_cmr?: number | string | null
}

const parseCmrStatusFilter = (
  value: number | string | null | undefined,
): number | null => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const status = Number(value)
  return [0, 1, 2].includes(status) ? status : null
}

// Shared by Search submit and CMR dropdown clear so filter logic stays in one place.
const buildComboSearchFilters = (params: ISearch): CrudFilters => {
  const cmrStatus = parseCmrStatusFilter(params.is_sent_to_cmr)

  return [
    {
      field: 'category_id',
      operator: 'eq',
      value: params.category_id ?? null,
    },
    {
      field: 'q',
      operator: 'eq',
      value: params.search ?? null,
    },
    ...(cmrStatus === null
      ? []
      : [
          {
            field: 'is_sent_to_cmr',
            operator: 'eq' as const,
            value: cmrStatus,
          },
        ]),
  ]
}

function useCombo() {
  const t = useTranslate()
  const { hasFullAccessModule } = useUserStore.getState()
  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_EDIT)

  const { tableProps, searchFormProps, setFilters } = useTable<
    ProductListItem,
    HttpError,
    ISearch
  >({
    pagination: { pageSize: 20 },
    resource: 'product-combos',
    filters: {},
    onSearch: (params) => buildComboSearchFilters(params),
  })

  useEffect(() => {
    const form = searchFormProps.form
    if (!form) {
      return
    }

    const raw = form.getFieldValue('is_sent_to_cmr')
    if (raw === null || raw === undefined || raw === '') {
      return
    }

    const status = Number(raw)
    if ([0, 1, 2].includes(status)) {
      if (raw !== status) {
        form.setFieldValue('is_sent_to_cmr', status)
      }
      return
    }

    form.setFieldValue('is_sent_to_cmr', undefined)
  }, [searchFormProps.form])

  const clearCmrFilterAndSearch = useCallback(() => {
    const form = searchFormProps.form
    if (!form) {
      return
    }

    form.setFieldValue('is_sent_to_cmr', undefined)
    const values = form.getFieldsValue() as ISearch
    setFilters(
      buildComboSearchFilters({ ...values, is_sent_to_cmr: undefined }),
      'replace',
    )
  }, [searchFormProps.form, setFilters])

  const columns = useMemo(() => {
    const cmrStatusMeta: Record<
      number,
      { label: string; color: string; backgroundColor: string }
    > = {
      0: {
        label: t('products.list.table.text.cmrNotLinked', 'CMR Not Linked'),
        color: '#E74C3C',
        backgroundColor: '#FDECEC',
      },
      1: {
        label: t('products.list.table.text.cmrInitiated', 'CMR連携開始'),
        color: '#2784FF',
        backgroundColor: '#E8F3FF',
      },
      2: {
        label: t('products.list.table.text.cmrLinked', 'CMR Linked'),
        color: '#1FDB51',
        backgroundColor: '#E9FBEE',
      },
    }

    const baseColumns = [
      {
        title: t('product_combos.list.table.headers.image'),
        dataIndex: 'image',
        key: 'image',
        width: 100,
        render: (_: unknown, record: any) =>
          (record as any).image_file_url ? (
            <Image
              src={(record as any).image_file_url}
              alt="Product Image"
              width={200}
              height={200}
              className="h-20 w-20 rounded-xl border object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-200 text-gray-400">
              <PictureOutlined style={{ fontSize: '40px', opacity: 0.5 }} />
            </div>
          ),
      },
      {
        title: t('product_combos.list.table.headers.assortmentCode'), // Product Code
        dataIndex: 'code',
        key: 'code',
        width: 140,
        render: (_: unknown, record: ProductListItem) => (
          <div>
            <Link
              href={`/product-combos/show/${record.id}`}
              onClick={() => {
                sessionStorage.setItem('list_products', 'products')
              }}
              className="!underline underline-offset-4"
            >
              {record.code}
            </Link>
            {(() => {
              const status = Number(record.is_sent_to_cmr ?? 0)
              const { label, color, backgroundColor } =
                cmrStatusMeta[status] ?? cmrStatusMeta[0]

              return (
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 6,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    lineHeight: '16px',
                    color,
                    backgroundColor,
                  }}
                >
                  {label}
                </span>
              )
            })()}
          </div>
        ),
      },
      {
        title: t('product_combos.list.table.headers.assortmentName'), // Product Name
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '13%',
      },
      {
        title: t('product_combos.list.table.headers.products'), // Bạn có thể đặt tên khác
        dataIndex: 'products', // Đây là key 'products' từ dữ liệu của bạn
        key: 'products',
        width: 250, // Cần tăng width để hiển thị danh sách tên dài
        render: (products: string[] | undefined) => {
          if (Array.isArray(products) && products.length > 0) {
            return products.join(', ')
          }
          return '-'
        },
      },
      {
        title: t('product_combos.list.table.headers.barcode'), // barcode
        dataIndex: 'barcode',
        key: 'barcode',
        width: '8%',
      },
      {
        title: t('product_combos.list.table.headers.subcategory'), // Category small
        dataIndex: 'category',
        key: 'category',
        align: 'left',
        width: '10%',
      },
      {
        title: t('product_combos.list.table.headers.unit'), // Unit
        dataIndex: 'unit',
        key: 'unit',
        width: '8%',
      },
      {
        title: (
          <>
            {t('product_combos.list.table.headers.costPrice')} <br /> (円)
          </>
        ), // cost_price (JPY)
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'center',
        width: '8%',
        render: (item: number) => item?.toLocaleString(),
      },
      {
        title: (
          <>
            {t('product_combos.list.table.headers.sellingPrice')} <br /> (円)
          </>
        ), // sale_price (JPY)
        dataIndex: 'sale_price',
        key: 'sale_price',
        width: '8%',
        render: (item: number) => item.toLocaleString(),
      },
      {
        title: t('table.actions'),
        dataIndex: 'action',
        key: 'action',
        width: 220,
        render(_, record) {
          return (
            <Space wrap size={4}>
              <ShowButton
                size="small"
                icon={null}
                autoInsertSpace={false}
                recordItemId={record.id}
                resource={'product-combos'}
                style={{
                  color: '#2784FF',
                  borderColor: '#2784FF',
                }}
              >
                {t('buttons.show')}
              </ShowButton>
              <EditButton
                size="small"
                icon={null}
                autoInsertSpace={false}
                recordItemId={record.id}
                resource={'product-combos'}
                style={{
                  color: '#FFFFFF',
                  background: '#1FDB51',
                  borderColor: '#1FDB51',
                }}
              >
                {t('buttons.edit')}
              </EditButton>
              <DeleteButton
                size="small"
                icon={null}
                autoInsertSpace={false}
                recordItemId={record.id}
                resource={'product-combos'}
                style={{
                  color: '#FFFFFF',
                  background: '#E74C3C',
                  borderColor: '#E74C3C',
                }}
              >
                {t('buttons.delete')}
              </DeleteButton>
            </Space>
          )
        },
      },
    ] as ColumnsType

    const numberColumnKeys = ['cost_price', 'sale_price', 'barcode']
    const centerColumnKeys = ['image', 'action']
    const dateColumnKeys = ['created_at', 'updated_at', 'deleted_at']

    return baseColumns.map((column) => {
      const key = String((column as any).key ?? (column as any).dataIndex ?? '')
      const originalOnCell = (column as any).onCell

      return {
        ...column,
        align: centerColumnKeys.includes(key)
          ? 'center'
          : numberColumnKeys.includes(key)
            ? 'right'
            : dateColumnKeys.includes(key)
              ? 'left'
              : 'left',
        onHeaderCell: (col: unknown) => {
          const originalHeaderCell = (column as any).onHeaderCell?.(col) ?? {}
          return {
            ...originalHeaderCell,
            style: {
              ...(originalHeaderCell as any).style,
              textAlign: 'center',
            },
          }
        },
        onCell: (record: unknown, rowIndex: number | undefined) => {
          const originalCell = originalOnCell?.(record as any, rowIndex) ?? {}
          return {
            ...originalCell,
            style: {
              ...(originalCell as any).style,
              padding: '8px 12px',
            },
          }
        },
      }
    }) as ColumnsType
  }, [t])

  return [
    {
      isFullAccess,
      columns,
      tableProps,
      searchFormProps,
    },
    { t, setFilters, clearCmrFilterAndSearch },
  ] as const
}

export default useCombo
