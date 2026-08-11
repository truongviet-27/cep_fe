/* eslint-disable @typescript-eslint/no-explicit-any */

import { PictureOutlined } from '@ant-design/icons'
import {
  resolveCmrStatusBadge,
  shouldShowCmrStatusBadge,
} from '@components/cep/merchandise/products/cmr-status'
import {
  ProductResourceEnum,
  ProductResourceLabelKey,
} from '@components/cep/merchandise/products/enum'
import { useIsCmrLinked } from '@components/cep/merchandise/products/use-is-cmr-linked'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { CrudFilters, HttpError } from '@refinedev/core'
import { useApiUrl, useCustomMutation, useTranslate } from '@refinedev/core'
import { PermissionEnum, type ProductListItem } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface ISearch {
  search: string
  category_id: string
  resource: string
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
const buildProductSearchFilters = (params: ISearch): CrudFilters => {
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
    {
      field: 'resource',
      operator: 'eq',
      value: params.resource ?? null,
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

function useProduct() {
  const t = useTranslate()
  const { isCmrLinked, cmrShopId } = useIsCmrLinked()
  const apiUrl = useApiUrl()
  const { hasFullAccessModule } = useUserStore.getState()
  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_EDIT)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<ProductListItem[]>([])
  const [isOpenManyDelete, setIsOpenManyDelete] = useState(false)

  const { mutate, isPending: isBulkDeleting } = useCustomMutation()

  const { tableProps, searchFormProps, setFilters, tableQuery } = useTable<
    ProductListItem,
    HttpError,
    ISearch
  >({
    pagination: { pageSize: 20 },
    resource: 'products',
    filters: {},
    onSearch: (params) => buildProductSearchFilters(params),
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

  const onSelectChange = useCallback(
    (newSelectedRowKeys: React.Key[], newSelectedRows: ProductListItem[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
      setSelectedRows(newSelectedRows)
    },
    [],
  )

  const rowSelection: TableRowSelection<ProductListItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const clearCmrFilterAndSearch = useCallback(() => {
    const form = searchFormProps.form
    if (!form) {
      return
    }

    form.setFieldValue('is_sent_to_cmr', undefined)
    const values = form.getFieldsValue() as ISearch
    setFilters(
      buildProductSearchFilters({ ...values, is_sent_to_cmr: undefined }),
      'replace',
    )
  }, [searchFormProps.form, setFilters])

  const handleBulkDelete = useCallback(() => {
    mutate(
      {
        values: {
          ids: selectedRows.map((item) => item.id),
        },
        method: 'delete',
        url: `${apiUrl}/products`,
        successNotification: (data) => {
          const apiMessage =
            (data as { message?: string } | undefined)?.message ??
            (data as { data?: { message?: string } } | undefined)?.data?.message

          return {
            message: apiMessage || t('notifications.success'),
            type: 'success' as const,
          }
        },
        errorNotification: (error) => ({
          message:
            (error as { message?: string })?.message ||
            t('notifications.deleteError'),
          description:
            (error as { message?: string })?.message ||
            t('notifications.deleteError'),
          type: 'error' as const,
        }),
      },
      {
        onSuccess: () => {
          setSelectedRowKeys([])
          setSelectedRows([])
          setIsOpenManyDelete(false)
          tableQuery.refetch()
        },
        onError: () => {
          setIsOpenManyDelete(false)
        },
      },
    )
  }, [mutate, selectedRows, apiUrl, t, tableQuery])

  const columns = useMemo(() => {
    const baseColumns = [
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
        width: '11%',
        onCell: () => ({
          style: {
            padding: '8px 12px',
            // Allow CMR badge to wrap under code (do not clip with nowrap/overflow).
            overflow: 'visible',
            whiteSpace: 'normal',
            verticalAlign: 'middle',
          },
        }),
        render: (_: unknown, record: ProductListItem) => (
          <div style={{ minWidth: 0 }}>
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
            {shouldShowCmrStatusBadge(
              isCmrLinked,
              cmrShopId,
              (record as { cmr_shop_id?: string | null }).cmr_shop_id,
              record.resource,
            ) &&
              (() => {
                const { label, color, backgroundColor } = resolveCmrStatusBadge(
                  record.resource,
                  record.is_sent_to_cmr,
                  t,
                )

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
                      whiteSpace: 'nowrap',
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
        title: t('products.list.table.headers.productName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '15%',
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
        title: t('products.fields.resource'),
        dataIndex: 'resource',
        key: 'resource',
        width: '8%',
        render: (val: string) =>
          t(
            ProductResourceLabelKey[val as ProductResourceEnum] ??
              ProductResourceLabelKey[ProductResourceEnum.MERCHANDISE],
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
        width: '14%',
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
        width: '13%',
        onCell: () => ({
          style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
        }),
        render(_: unknown, record: ProductListItem) {
          return (
            <Space wrap size={4}>
              <ShowButton
                autoInsertSpace={false}
                size="small"
                icon={null}
                recordItemId={record.id}
                resource="products"
                style={{
                  color: '#2784FF',
                  borderColor: '#2784FF',
                }}
              >
                {t('buttons.show')}
              </ShowButton>
              <EditButton
                autoInsertSpace={false}
                size="small"
                icon={null}
                recordItemId={record.id}
                resource="products"
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
                recordItemId={record.id}
                resource="products"
                errorNotification={(error) => ({
                  message:
                    (error as { message?: string })?.message ||
                    t('notifications.deleteError'),
                  description:
                    (error as { message?: string })?.message ||
                    t('notifications.deleteError'),
                  type: 'error',
                })}
                style={{
                  color: '#FFFFFF',
                  background: '#E74C3C',
                }}
              >
                {t('buttons.delete')}
              </DeleteButton>
            </Space>
          )
        },
      },
    ] as ColumnsType

    const numberColumnKeys = [
      'packaging_count',
      'cost_price',
      'sale_price',
      'barcode',
    ]
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
  }, [t, isCmrLinked, cmrShopId])

  return [
    {
      isFullAccess,
      columns,
      tableProps,
      searchFormProps,
      rowSelection,
      selectedRowKeys,
      isOpenManyDelete,
      isBulkDeleting,
    },
    {
      t,
      setFilters,
      setIsOpenManyDelete,
      handleBulkDelete,
      clearCmrFilterAndSearch,
    },
  ] as const
}

export default useProduct
