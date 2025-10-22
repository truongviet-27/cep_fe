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

  const [options, setOptions] =
    useState<{ label: string | undefined; value: number | undefined }[]>()

  const product = Form.useWatch(filterPath1, form)
  const customer = Form.useWatch(filterPath2, form)

  const package_id = Form.useWatch(
    ['main_product', index, 'products', index2, 'package_id'],
    form,
  )

  const { data } = useCustom<any>({
    url: `${apiUrl}/${resource}/${product}/customer-pricing/${customer?.value}`,
    method: 'get',
    queryOptions: {
      enabled: !!product && !!customer,
    },
  })

  const { query: productResponse } = useShow<ProductDetail>({
    resource: 'products',
    id: product,
    queryOptions: {
      enabled: !!product && !customer,
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
      form.setFieldValue(
        [parent, index, 'products', index2, 'package_id'],
        data?.data?.packagings[0]?.id || null,
      )
    } else if (productResponse?.data?.data) {
      setOptions(
        productResponse.data?.data?.packagings?.map((item) => ({
          label: item?.name,
          value: item?.id,
        })),
      )
    }
  }, [data, productResponse?.data?.data])

  useEffect(() => {
    const option = data?.data.packagings?.find(
      (item: any) => item?.id === package_id,
    )

    if (option) {
      form.setFieldValue(
        [parent, index, 'products', index2, 'selling_price'],
        option?.rank_prices ? option?.rank_prices : option?.selling_price,
      )
    } else {
      form.setFieldValue(
        [parent, index, 'products', index2, 'selling_price'],
        data?.data?.selling_price ?? 0,
      )
    }
  }, [data, customer])

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
      autoClearSearchValue
      allowClear
      onChange={(value) => {
        if (onChange) {
          onChange(value)
        }
        const option = (data?.data.packagings).find(
          (item: any) => item?.id === value,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'unit'],
          option?.unit ?? data?.data?.unit?.name,
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'cost_price'],
          value
            ? (data?.data?.cost_price ?? 0) * (option?.quantity_in_package ?? 0)
            : (data?.data?.cost_price ?? 0),
        )

        form.setFieldValue(
          [parent, index, 'products', index2, 'selling_price'],
          option?.rank_prices * 1
            ? (option?.rank_prices ?? 0)
            : (option?.selling_price ?? data?.data.selling_price),
        )

        form.setFieldValue([parent, index, 'products', index2, 'quantity'], 1)
      }}
      disabled={!product}
    />
  )
}

export default CoreAutoComplete
