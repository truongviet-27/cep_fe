import { useTranslate } from '@refinedev/core'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useMemo, useState } from 'react'

function useProduct() {
  const t = useTranslate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const onChangePageSize = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const columns = useMemo(() => {
    return [
      {
        title: t('商品コード'), // Product Code
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: t('商品名'), // Product Name
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: t('受渡数'), // Quantity
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: t('バーコード'), // Barcode
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: t('カテゴリ(小)'), // Category small
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: t('単位'), // Unit
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: t('原価 (円)'), // Cost (JPY)
        dataIndex: 'cost',
        key: 'cost',
        align: 'right',
      },
      {
        title: t('販売価格 (円)'), // Price (JPY)
        dataIndex: 'price',
        key: 'price',
        align: 'right',
      },
    ] as ColumnsType
  }, [t])

  const dataSource = [
    {
      key: '1',
      productCode: (
        <Link
          href={`/products/${'PROD001'}?actionType=VIEW`}
          className="!underline"
        >
          PROD001
        </Link>
      ),
      productName: 'システム設計・開発',
      quantity: '-',
      barcode: '1001930006191',
      category: 'ソフトウェア開発',
      unit: '人日',
      cost: '600,000',
      price: '800,000',
    },
  ]
  return [
    { dataSource, columns, page, pageSize, total: 20 },
    { t, onChangePageSize },
  ] as const
}

export default useProduct
