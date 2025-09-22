import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import type { ProductListItem } from '@sdk/hey-api'
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

  const { tableProps, searchFormProps } = useTable<
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
        title: t('products.list.table.headers.productCode'), // Product Code
        dataIndex: 'code',
        key: 'code',
        width: 200,
        render: (_: unknown, record: ProductListItem) => (
          <Link href={`/products/show/${record.id}`} className="!underline">
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
        width: 120,
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
        title: t('products.list.table.headers.costPrice'), // cost_price (JPY)
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'center',
        render: (item: number) => item.toLocaleString(),
      },
      {
        title: t('products.list.table.headers.sellingPrice'), // sale_price (JPY)
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
      columns,
      tableProps,
      searchFormProps,
    },
    { t },
  ] as const
}

export default useProduct
