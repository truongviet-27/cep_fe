import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { ProductDetail, ProductPackaging } from '@sdk/hey-api'
import type { ColumnsType } from 'antd/es/table'
import { forEach } from 'lodash'
import { useMemo } from 'react'

interface PriceGroupProps {
  product: ProductDetail
}

const PriceGroup: React.FC<PriceGroupProps> = ({ product }) => {
  const t = useTranslate()

  const columns = useMemo(() => {
    const result = [
      {
        title: t('products.fields.productCode'),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: t('products.fields.productName'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('products.unitPriceGroup.sellingPrice'),
        dataIndex: 'selling_price',
        key: 'selling_price',
      },
      {
        title: t('products.unitPriceGroup.settingMethod'),
        dataIndex: 'is_active',
        key: 'is_active',
        render: (value: boolean) =>
          value ? t('products.text.active') : t('products.text.inactive'),
      },
    ] as ColumnsType

    const ranks = product?.packagings?.[0]?.rank_prices

    if (ranks) {
      forEach(ranks, (rank) => {
        result.push({
          title: (
            <>
              {rank.rank_name}
              <br />
              {rank.rate}% (円)
            </>
          ),
          dataIndex: `rank_${rank.rank_id}`,
          key: `rank_${rank.rank_id}`,
        })
      })
    }

    return result
  }, [])

  const dataSource = useMemo(() => {
    return (product?.packagings || []).map((item: ProductPackaging) => {
      const ranks = item.rank_prices
      const rankItem: { [key: string]: number } = {}
      if (ranks) {
        forEach(ranks, (rank) => {
          rankItem[`rank_${rank.rank_id}`] = Number((rank.price || 0) / 100)
        })
      }

      return {
        ...item,
        barcode: product.barcode || '',
        ...rankItem,
      }
    })
  }, [product])

  return (
    <div>
      <div className="m-3 font-bold">
        {t('products.unitPriceGroup.tableTitle')}
      </div>

      <CommonTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  )
}

export default PriceGroup
