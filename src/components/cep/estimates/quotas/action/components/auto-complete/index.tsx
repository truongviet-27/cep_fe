/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { useApiUrl, useCustom, useList, useTranslate } from '@refinedev/core'
import { AutoComplete, Form, Select } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { useEffect, useState } from 'react'

function CoreAutoComplete({
  filterPath1,
  filterPath2,
  resource,
  onChange,
  style,
  labelPath = 'name',
  valuePath = 'id',
  params,
  index,
  index2,
  parent,
  ...rest
}: {
  resource: string
  onChange?: (val: any) => void
  style?: React.CSSProperties
  filterPath1?: string[]
  filterPath2?: string[]
  labelPath?: any
  valuePath?: any
  params?: any
  index: number
  index2: number
  parent: string
}) {
  const t = useTranslate()

  const apiUrl = useApiUrl()

  const form = useFormInstance()

  const [options, setOptions] = useState([])

  const filter1 = Form.useWatch(filterPath1, form)
  const filter2 = Form.useWatch(filterPath2, form)

  const { data } = useCustom({
    url: `${apiUrl}/${resource}/${filter1}/customer-pricing/${filter2?.value}`,
    method: 'get',
    queryOptions: {
      enabled: !!filter1 && !!filter2,
    },
  })

  useEffect(() => {
    if (data?.data) {
      setOptions(
        data.data.packagings.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      )
    }
  }, [data])

  return (
    <Select
      options={options}
      {...rest}
      style={style}
      showSearch
      placeholder={t('placeholders.select')}
      filterOption={false}
      autoClearSearchValue
      allowClear
      onChange={(value) => {
        if (onChange) {
          onChange(value)
        }
        const option = data?.data.packagings.find(
          (item: any) => item?.id === value,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'unit'],
          option?.unit,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'cost_price'],
          option?.standard_price,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'selling_price'],
          option?.rank_prices ?? option?.selling_price,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'quantity'],
          option?.quantity_in_package,
        )
      }}
      disabled={!filter1 || !filter2}
    />
  )
}

export default CoreAutoComplete
