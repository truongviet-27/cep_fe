/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from '@hook/use-debounce'
import { useList, useTranslate } from '@refinedev/core'
import { Select } from 'antd'
import { useEffect, useState } from 'react'

function CoreAutoComplete({
  name,
  resource,
  value,
  onChange,
  style,
}: {
  name: string
  resource: string
  value?: any
  onChange?: (val: any) => void
  style?: React.CSSProperties
}) {
  const t = useTranslate()
  const [searchValue, setSearchValue] = useState<string>()
  const [options, setOptions] = useState<any>([])

  const searchDebounce = useDebounce(searchValue, 500)

  const { data } = useList({
    resource: resource,
    filters: [{ field: name, operator: 'contains', value: searchDebounce }],
    queryOptions: {
      enabled: !!searchDebounce,
    },
    pagination: {
      mode: 'off',
    },
  })

  useEffect(() => {
    if (searchDebounce) {
      setOptions(data?.data)
    } else {
      setOptions([] as any[])
    }
  }, [data, searchDebounce])

  return (
    <Select
      style={style}
      showSearch
      placeholder={t('buttons.search')}
      labelInValue
      filterOption={false}
      onSearch={(value) => {
        setSearchValue(value)
      }}
      autoClearSearchValue
      value={value}
      onChange={onChange}
      allowClear
      onClear={() => {
        setOptions([] as any[])
      }}
      options={(options ?? []).map((item: any) => ({
        value: item.id,
        label: item.name,
      }))}
    />
  )
}

export default CoreAutoComplete
