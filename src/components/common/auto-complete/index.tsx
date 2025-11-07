/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Form, Select } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { useEffect, useState } from 'react'

function CoreAutoComplete({
  nameFilter,
  filterPath,
  resource,
  onChange,
  style,
  labelPath = 'name',
  valuePath = 'id',
  params,
  ...rest
}: {
  nameFilter: string
  resource: string
  onChange?: (val: any) => void
  style?: React.CSSProperties
  filterPath?: any
  labelPath?: any
  valuePath?: any
  params?: any
}) {
  const t = useTranslate()

  const form = useFormInstance()

  const filter = Form.useWatch(filterPath, form)
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  const { selectProps, query } = useSelect({
    resource: resource,
    optionValue: valuePath,
    optionLabel: labelPath,
    filters: filter
      ? [{ field: nameFilter, operator: 'eq', value: filter }]
      : [],
    queryOptions: {
      enabled: !!filterPath && !!filter,
    },
  })

  useEffect(() => {
    if (query.data?.data) {
      const result = query.data.data
        ?.filter((item) => item.role.name !== 'employee')
        .map((item) => ({ label: item.name, value: item.id })) as any

      setOptions(result)
    }
  }, [query.data?.data])

  return (
    <Select
      {...selectProps}
      {...rest}
      options={options}
      style={style}
      showSearch
      placeholder={t('placeholders.select')}
      filterOption={(input, option) =>
        ((option?.label ?? '') as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      autoClearSearchValue
      allowClear
      onChange={onChange}
      disabled={!filter}
    />
  )
}

export default CoreAutoComplete
