/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiUrl, useCustom, useShow, useTranslate } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { Form, Select } from 'antd'
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
  data,
  customer,
  productsData,
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
  data: any
  customer: any
  productsData: any
}) {
  const t = useTranslate()

  const form = useFormInstance()

  const [options, setOptions] =
    useState<{ label: string | undefined; value: number | undefined }[]>()

  const product = Form.useWatch(filterPath1, form)
  const packageWatch = Form.useWatch(
    [parent, index, 'products', index2, 'package'],
    form,
  )

  useEffect(() => {
    if (data?.packagings) {
      setOptions(
        data?.packagings.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      )
    }
  }, [data])

  useEffect(() => {
    if (data) {
      const option = data?.packagings?.find(
        (item: any) => item?.id === packageWatch?.value,
      )
      if (option) {
        form.setFieldValue(
          [parent, index, 'products', index2, 'selling_price'],
          option?.rank_prices ? option?.rank_prices : option?.selling_price,
        )
      }
    }
  }, [data])

  return (
    <Select
      options={options}
      {...rest}
      style={style}
      showSearch
      placeholder={t('placeholders.select')}
      filterOption={(input, option) =>
        ((option?.label ?? '') as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onSearch={() => {}}
      onChange={(value) => {
        if (onChange) {
          onChange(value)
        }
        const option = data?.packagings.find((item: any) => item?.id === value)

        form.setFieldValue(
          [parent, index, 'products', index2, 'package_id'],
          option?.id,
        )
        form.setFieldValue(
          [parent, index, 'products', index2, 'package_name'],
          option?.name,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'unit'],
          option?.unit,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'unit_name'],
          option?.unit ?? data?.unit?.name,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'tax_rate'],
          option?.tax_rate ?? data?.tax_rate,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'cost_price'],
          value
            ? (data?.cost_price ?? 0) * (option?.quantity_in_package ?? 0)
            : (data?.cost_price ?? 0),
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'selling_price'],
          option?.rank_prices * 1
            ? (option?.rank_prices ?? 0)
            : (option?.selling_price ?? data?.selling_price),
        )

        form.setFieldValue([parent, index, 'products', index2, 'quantity'], 1)
      }}
      disabled={!product}
    />
  )
}

export default CoreAutoComplete
