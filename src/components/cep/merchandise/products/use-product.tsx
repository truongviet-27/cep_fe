/* eslint-disable @typescript-eslint/no-explicit-any */

import { PictureOutlined } from '@ant-design/icons'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PermissionEnum, type ProductListItem } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useMemo } from 'react'

interface ISearch {
  search: string
  category_id: string
}

function useProduct() {
  const t = useTranslate()
  const { hasFullAccessModule } = useUserStore.getState()
  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_EDIT)

  const { tableProps, searchFormProps, setFilters } = useTable<
    ProductListItem,
    HttpError,
    ISearch
  >({
    resource: 'products',
    filters: {},
    onSearch: (params) => [
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
    ],
  })

  const columns = useMemo(() => {
    return [
      {
        title: t('products.list.table.headers.image'),
        dataIndex: 'code',
        key: 'code',
        width: 100,
        render: (_: unknown, record: any) =>
          (record as any).image_file_url ? (
            <img
              src={(record as any).image_file_url}
              alt="Product"
              className="h-20 w-20 rounded-xl border object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-200 text-gray-400">
              <PictureOutlined style={{ fontSize: '40px', opacity: 0.5 }} />
            </div>
          ),
      },
      {
        title: t('products.list.table.headers.productCode'), // Product Code
        dataIndex: 'code',
        key: 'code',
        width: 120,
        render: (_: unknown, record: ProductListItem) => (
          <Link
            href={`/products/show/${record.id}`}
            onClick={() => {
              sessionStorage.setItem('list_products', 'products')
            }}
            className="!underline"
          >
            {record.code}
          </Link>
        ),
      },
      {
        title: t('products.list.table.headers.productName'), // Product Name
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '20%',
      },
      {
        title: t('products.list.table.headers.packagingQuantity'), // packaging_count
        dataIndex: 'packaging_count',
        key: 'packaging_count',
        width: 80,
        render: (value: number) => {
          if (typeof value === 'number') {
            return value - 1 //minus main product
          }
          return ''
        },
      },
      {
        title: t('products.list.table.headers.barcode'), // barcode
        dataIndex: 'barcode',
        key: 'barcode',
        width: '10%',
      },
      {
        title: t('products.list.table.headers.subcategory'), // Category small
        dataIndex: 'category',
        key: 'category',
        align: 'left',
        width: '20%',
      },
      {
        title: t('products.list.table.headers.unit'), // Unit
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: (
          <>
            {t('products.list.table.headers.costPrice')} <br /> (円)
          </>
        ), // cost_price (JPY)
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'center',
        render: (item: number) => item?.toLocaleString(),
      },
      {
        title: (
          <>
            {t('products.list.table.headers.sellingPrice')} <br /> (円)
          </>
        ), // sale_price (JPY)
        dataIndex: 'sale_price',
        key: 'sale_price',
        render: (item: number) => item.toLocaleString(),
      },
      {
        title: t('table.actions'),
        dataIndex: 'action',
        key: 'action',
        width: 120,
        render(_, record) {
          return (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )
        },
      },
    ] as ColumnsType
  }, [t])

  return [
    {
      isFullAccess,
      columns,
      tableProps,
      searchFormProps,
    },
    { t, setFilters },
  ] as const
}

export default useProduct
