import { useShow } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { Select } from 'antd'
import { useMemo } from 'react'

interface Props {
  productId?: number
  defaultOptions?: { id: number; name: string }[]
  onChange?: (value: number) => void
}

const PackageSelect: React.FC<Props> = (props) => {
  const { productId, defaultOptions, onChange } = props

  const { query: productResponse } = useShow<ProductDetail>({
    resource: 'products',
    id: productId,
    queryOptions: {
      enabled: !!productId && !defaultOptions?.length,
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
      options={options}
      placeholder="-"
      disabled={!productId || productResponse.isFetching}
      loading={productResponse.isFetching}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase())
      }
      onChange={onChange}
    />
  )
}

export default PackageSelect
