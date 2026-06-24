/* eslint-disable @typescript-eslint/no-explicit-any */

import { PictureOutlined } from '@ant-design/icons'
import {
  ProductResourceEnum,
  ProductResourceLabel,
} from '@components/cep/merchandise/products/enum'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PermissionEnum, type ProductListItem } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

interface ISearch {
  search: string
  category_id: string
  resource: string
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
      {
        field: 'resource',
        operator: 'eq',
        value: params.resource ?? null,
      },
    ],
  })

  const columns = useMemo(() => {
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
          <Link
            href={`/product-combos/show/${record.id}`}
            onClick={() => {
              sessionStorage.setItem('list_products', 'products')
            }}
            className="!underline underline-offset-4"
          >
            {record.code}
          </Link>
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
        title: 'セット区分',
        dataIndex: 'resource',
        key: 'resource',
        width: '8%',
        render: (val: string) =>
          ProductResourceLabel[val as ProductResourceEnum] ??
          ProductResourceLabel[ProductResourceEnum.MERCHANDISE],
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
    { t, setFilters },
  ] as const
}

export default useCombo
