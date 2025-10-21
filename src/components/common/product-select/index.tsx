/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import type { ProductListItem } from '@sdk/hey-api'
import { SEARCH_TIMEOUT } from '@utility/constant'
import { Empty, Select, Spin } from 'antd'
import { debounce } from 'lodash'
import { memo, useMemo, useState } from 'react'

interface Props {
  defaultValue?: any
  onChange?: (value: ProductListItem) => void
}

const ProductSelect: React.FC<Props> = (props) => {
  const { defaultValue, onChange: onSelectChange } = props
  const [isTriggerGetProduct, setIsTriggerGetProduct] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    filters: [
      {
        field: 'q',
        operator: 'eq',
        value: searchText,
      },
      { field: '_per_page', operator: 'eq', value: 30 },
    ],
    queryOptions: {
      enabled: isTriggerGetProduct,
    },
    onSearch(value) {
      return [
        {
          field: 'name',
          operator: 'contains',
          value,
        },
      ]
    },
  })

  const onChange = (value: any) => {
    const item = query.data?.data.find(
      (item) => item.id === value,
    ) as ProductListItem

    onSelectChange?.(item)
  }

  const debounceFetcher = useMemo(
    () => debounce(setSearchText, SEARCH_TIMEOUT),
    [],
  )

  return (
    <Select
      {...selectPropsProduct}
      placeholder="商品名・サービス名で検索"
      // allowClear
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      onChange={onChange}
      onFocus={() => setIsTriggerGetProduct(true)}
      notFoundContent={query.isFetching ? <Spin size="small" /> : <Empty />}
      loading={query.isFetching}
      defaultValue={defaultValue}
    />
  )
}

export default memo(ProductSelect)
