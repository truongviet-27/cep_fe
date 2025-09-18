/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseRecord } from '@refinedev/core'
import { useSelect, useTranslate } from '@refinedev/core'
import { Select } from 'antd'
import { useEffect, useState } from 'react'

function CoreAutoComplete({
  name,
  resource,
  value,
  onChange,
  debounce = 400,
  placeholder,
}: {
  name: string
  resource: string
  placeholder?: string
  debounce?: number
  value?: any
  onChange?: (val: any) => void
}) {
  const t = useTranslate()
  const [options, setOptions] = useState<
    | {
        label: BaseRecord
        value: BaseRecord
      }[]
    | []
  >([])

  const { queryResult, onSearch } = useSelect({
    resource,
    debounce,
    onSearch: name
      ? (val) => [{ field: name, operator: 'null', value: val }]
      : undefined,
  })

  useEffect(() => {
    if (queryResult?.data?.data) {
      const result =
        queryResult?.data?.data.map((item) => {
          return {
            label: item,
            value: item,
          }
        }) ?? []
      setOptions(result)
    } else {
      setOptions([])
    }
  }, [queryResult?.data?.data])

  return (
    <Select
      showSearch
      placeholder={placeholder ?? t('placeholders.partial_match')}
      labelInValue
      filterOption={false}
      onSearch={(value) => value && onSearch(value)}
      autoClearSearchValue
      value={value}
      onChange={onChange}
      allowClear
      onClear={() => {
        setOptions([])
      }}
      options={options}
    />
  )
}

export default CoreAutoComplete
