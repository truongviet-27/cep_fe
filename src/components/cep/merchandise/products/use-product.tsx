/* eslint-disable @typescript-eslint/no-explicit-any */

import { PictureOutlined } from '@ant-design/icons'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PermissionEnum, type ProductListItem } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
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
    pagination: { pageSize: 20 },
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
        dataIndex: 'image',
        key: 'image',
        width: '10%',
        align: 'center',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textAlign: 'center',
          },
        }),
        render: (_: unknown, record: any) => {
          const sizePx = 80
          const wrapperStyle: CSSProperties = {
            width: sizePx,
            height: sizePx,
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {(record as any).image_file_url ? (
                <div style={wrapperStyle}>
                  <Image
                    src={(record as any).image_file_url}
                    alt="Product Image"
                    width={sizePx}
                    height={sizePx}
                    className="rounded-xl border object-cover shadow-sm"
                    style={{
                      width: sizePx,
                      height: sizePx,
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-200 text-gray-400"
                  style={wrapperStyle}
                >
                  <PictureOutlined style={{ fontSize: 32, opacity: 0.5 }} />
                </div>
              )}
            </div>
          )
        },
      },
      {
        title: t('products.list.table.headers.productCode'),
        dataIndex: 'code',
        key: 'code',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_: unknown, record: ProductListItem) => (
          <Link
            href={`/products/show/${record.id}`}
            onClick={() => {
              sessionStorage.setItem('list_products', 'products')
            }}
            className="!underline"
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.code}
          </Link>
        ),
      },
      {
        title: t('products.list.table.headers.productName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '21%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val}
          </div>
        ),
      },
      {
        title: t('products.list.table.headers.packagingQuantity'),
        dataIndex: 'packaging_count',
        key: 'packaging_count',
        width: '5%',
        render: (value: number) => {
          if (typeof value === 'number') {
            return value - 1
          }
          return ''
        },
      },
      {
        title: t('products.list.table.headers.barcode'),
        dataIndex: 'barcode',
        key: 'barcode',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val ?? '-'}
          </div>
        ),
      },
      {
        title: t('products.list.table.headers.subcategory'),
        dataIndex: 'category',
        key: 'category',
        align: 'left',
        width: '19%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val ?? '-'}
          </div>
        ),
      },
      {
        title: t('products.list.table.headers.unit'),
        dataIndex: 'unit',
        key: 'unit',
        width: '5%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val ?? '-'}
          </div>
        ),
      },
      {
        title: (
          <>
            {t('products.list.table.headers.costPrice')} <br /> (円)
          </>
        ),
        dataIndex: 'cost_price',
        key: 'cost_price',
        width: '8%',
        align: 'center',
        render: (item: number) => item?.toLocaleString(),
      },
      {
        title: (
          <>
            {t('products.list.table.headers.sellingPrice')} <br /> (円)
          </>
        ),
        dataIndex: 'sale_price',
        key: 'sale_price',
        width: '8%',
        render: (item: number) => item?.toLocaleString(),
      },
      {
        title: t('table.actions'),
        dataIndex: 'action',
        key: 'action',
        width: '8%',
        render(_: unknown, record: ProductListItem) {
          return (
            <Space wrap size={4}>
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
