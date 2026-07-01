/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import type { ProductListItem } from '@sdk/hey-api'
import { memo } from 'react'

interface Props {
  name: any
  rules?: any[]
  defaultValue?: any
  onChangeValue?: (
    value: ProductListItem & {
      tax_rate: number
      packagings: any[]
    },
  ) => void
  allowClear?: boolean
  filters?: any
}

const ProductSelect = ({
  name,
  rules,
  defaultValue,
  onChangeValue,
  allowClear,
  filters,
}: Props) => {
  return (
    <CoreAutocompleteAPI
      key={`product-select-${defaultValue?.value ?? 'empty'}`}
      name={name}
      resource="products/list-all"
      rules={rules}
      defaultValue={defaultValue}
      labelInValue={false}
      pageSize={30}
      allowClear={allowClear ?? false}
      placeholder="商品名・サービス名で検索"
      onChangeValue={onChangeValue}
      filters={filters}
    />
  )
}

export default memo(ProductSelect)
