/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShow, useTranslate } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { Empty, Select, Spin } from 'antd'
import { memo, useMemo, useState } from 'react'

interface Props {
  productId?: number
  defaultOptions?: { id: number; name: string }[]
  defaultValue?: any
  onChange?: (value: number, option: any) => void
  style?: React.CSSProperties
}

const PackageSelect: React.FC<Props> = (props) => {
  const t = useTranslate()
  const { productId, defaultOptions, defaultValue, onChange, style } = props
  const [isTriggerGetProduct, setIsTriggerGetProduct] = useState<boolean>(false)

  const { query: productResponse } = useShow<ProductDetail>({
    resource: 'products',
    id: productId,
    queryOptions: {
      enabled: !!productId && !defaultOptions?.length && isTriggerGetProduct,
    },
  })

  const options = useMemo(() => {
    const resource = defaultOptions?.length
      ? defaultOptions
      : productResponse.data?.data?.packagings

    return (resource || []).map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }))
  }, [productResponse.data?.data, defaultOptions])

  return (
    <Select
      allowClear
      showSearch
      filterOption={true}
      optionFilterProp="label"
      options={productResponse.isFetching ? [] : options}
      placeholder={t('placeholders.select')}
      disabled={!productId}
      loading={productResponse.isFetching}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase())
      }
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={() => setIsTriggerGetProduct(true)}
      notFoundContent={
        productResponse.isFetching ? <Spin size="small" /> : <Empty />
      }
      style={style}
    />
  )
}

export default memo(PackageSelect)
