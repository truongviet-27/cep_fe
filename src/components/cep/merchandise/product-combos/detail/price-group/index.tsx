import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import {
  ParameterResourceEnum,
  type ProductDetail,
  type ProductPackaging,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import type { ColumnsType } from 'antd/es/table'
import { forEach, sortBy } from 'lodash'
import { useMemo } from 'react'

interface PriceGroupProps {
  product: ProductDetail
}

const PriceGroup: React.FC<PriceGroupProps> = ({ product }) => {
  const t = useTranslate()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  const columns = useMemo(() => {
    const result = [
      {
        title: t('product_combos.fields.assortmentCode'),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: t('product_combos.fields.assortmentName'),
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
        dataIndex: 'is_rate_based',
        key: 'is_rate_based',
        render: (value: boolean) => (value ? '掛率' : '絶対'),
      },
    ] as ColumnsType

    const ranks = sortBy(product?.packagings?.[0]?.rank_prices || [], 'rate')

    if (ranks) {
      forEach(ranks, (rank) => {
        result.push({
          title: (
            <>
              {rank.rank_code}
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
      if (ranks && parameterSettings?.get?.(ParameterResourceEnum.RANKS)) {
        forEach(ranks, (rank) => {
          rankItem[`rank_${rank.rank_id}`] = Number(rank.price)
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
        scroll={{ y: 55 * 5 }}
      />
    </div>
  )
}

export default PriceGroup
