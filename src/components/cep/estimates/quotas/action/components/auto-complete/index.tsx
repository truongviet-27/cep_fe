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
  parent,
  data,
  customer,
  productsData,
  labelInValue = false,
  isAwaitingDecision = false,
  onPriceComputed,
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
  parent: string
  data: any
  customer: any
  productsData: any
  labelInValue?: boolean
  isAwaitingDecision?: boolean
  onPriceComputed?: (
    parent: string,
    index: number,
    oldPrice: number,
    newPrice: number,
    field?: 'selling_price' | 'cost_price',
    productId?: number,
  ) => void
}) {
  const t = useTranslate()

  const form = useFormInstance()

  const [options, setOptions] =
    useState<{ label: string | undefined; value: number | undefined }[]>()

  const product = Form.useWatch(filterPath1, form)
  const packageWatch = Form.useWatch([parent, index, 'package'], form)

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
        const newPrice = option?.rank_prices
          ? option?.rank_prices
          : option?.selling_price
        const newCostPrice =
          (data?.cost_price ?? 0) * (option?.quantity_in_package ?? 0)
        if (isAwaitingDecision && onPriceComputed) {
          const oldPrice = form.getFieldValue([parent, index, 'selling_price'])
          onPriceComputed(
            parent,
            index,
            oldPrice,
            newPrice,
            'selling_price',
            data?.id,
          )
          const oldCostPrice = form.getFieldValue([parent, index, 'cost_price'])
          onPriceComputed(
            parent,
            index,
            oldCostPrice,
            newCostPrice,
            'cost_price',
            data?.id,
          )
        } else {
          form.setFieldValue([parent, index, 'selling_price'], newPrice)
        }
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
      labelInValue={labelInValue}
      onSearch={() => {}}
      onChange={(value) => {
        if (onChange) {
          onChange(value)
        }
        const option = data?.packagings.find(
          (item: any) => item?.id === value.value,
        )

        form.setFieldValue([parent, index, 'package_id'], option?.id)
        form.setFieldValue([parent, index, 'package_name'], option?.name)

        form.setFieldValue(
          [parent, index, 'unit'],
          option?.unit_name ?? data?.unit_name,
        )

        form.setFieldValue(
          [parent, index, 'unit_name'],
          option?.unit_name ?? data?.unit_name,
        )

        form.setFieldValue(
          [parent, index, 'tax_rate'],
          option?.tax_rate ?? data?.tax_rate,
        )

        form.setFieldValue(
          [parent, index, 'cost_price'],
          value
            ? (data?.cost_price ?? 0) * (option?.quantity_in_package ?? 0)
            : (data?.cost_price ?? 0),
        )

        form.setFieldValue(
          [parent, index, 'selling_price'],
          option?.rank_prices * 1
            ? (option?.rank_prices ?? 0)
            : (option?.selling_price ?? data?.selling_price),
        )

        form.setFieldValue([parent, index, 'quantity'], 1)
      }}
      disabled={!product}
    />
  )
}

export default CoreAutoComplete
