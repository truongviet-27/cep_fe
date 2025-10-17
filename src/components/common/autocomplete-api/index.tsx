/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { Empty, Form, Select, Spin, Typography } from 'antd'
import { type DefaultOptionType, type SelectProps } from 'antd/es/select'
import { get, join } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'

type SelectPropsForm<
  ValueType = any,
  OptionType extends DefaultOptionType = DefaultOptionType,
> = SelectProps<ValueType, OptionType> & {
  name: string
  resource: string
  label?: React.ReactNode
  optionLabel?: any
  optionValue?: any
  labelPathDisplay?: string[]
  required?: boolean
  rules?: any[]
  AutoCompleteClassName?: string
  labelInValue?: boolean
  onChangeValue?: (value: any, option?: any) => void
}

export const CoreAutocompleteAPI = (props: SelectPropsForm) => {
  const {
    name,
    resource,
    label,
    placeholder,
    optionLabel = 'name',
    optionValue = 'id',
    labelPathDisplay = [optionLabel, 'customer_code'],
    required,
    rules,
    mode,
    defaultValue,
    disabled = false,
    labelInValue = true,
    onChangeValue,

    ...restProps
  } = props

  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(100)
  const [isClick, setIsClick] = useState(false)
  const [isPreApply, setIsPreApply] = useState(false)

  const [options, setOptions] = useState<any[]>([])

  const { selectProps, query } = useSelect({
    resource,
    optionLabel,
    optionValue,
    pagination: {
      mode: 'server',
      current,
      pageSize,
    },
    queryOptions: {
      enabled: isClick,
      refetchOnWindowFocus: false,
    },
    onSearch(value) {
      setIsPreApply(false)
      setCurrent(1)
      if (!value) return []
      return [{ field: 'q', operator: 'eq', value }]
    },
  })

  useEffect(() => {
    if (query.data?.data) {
      setOptions((prev) => [...(isPreApply ? prev : []), ...query.data.data])
    }
  }, [query.data?.data])
  console.log(current, isPreApply, options, 'options')

  const handlePopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      console.log(
        scrollTop + clientHeight >= scrollHeight - 10,
        !query.isFetching,
        (query.data?.total ?? 0) > options.length,
        current,
        isPreApply,
        options,
        'options3',
      )
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        !query.isFetching &&
        (query.data?.total ?? 0) > options.length
      ) {
        setIsPreApply(true)
        setCurrent((prev) => prev + 1)
      }
    },
    [options, query.data?.data],
  )

  const formatOptionLabel = (option: any) =>
    join(
      labelPathDisplay.map((key: string) => get(option, key)),
      ' - ',
    )

  return (
    <Form.Item name={name} required={required} label={label} rules={rules}>
      <Select
        {...selectProps}
        options={options.map((opt) => ({
          label: opt.name,
          value: opt.id,
          data: opt,
        }))}
        defaultValue={defaultValue}
        loading={query.isFetching}
        notFoundContent={
          query.isFetching ? (
            <div className="flex w-full justify-center">
              <Spin
                style={{
                  width: '100%',
                }}
                size="small"
              />
            </div>
          ) : (
            <Empty />
          )
        }
        filterOption={false}
        disabled={disabled}
        mode={mode}
        onChange={(value) => {
          console.log(value, 'value')
          if (onChangeValue) {
            onChangeValue(value)
          }
        }}
        onClick={() => {
          setIsClick(true)
        }}
        onPopupScroll={handlePopupScroll}
        allowClear
        onClear={() => {
          selectProps.onSearch?.('')
          setCurrent(1)
        }}
        placeholder={placeholder}
        labelInValue={labelInValue}
        optionRender={(oriOption) => {
          return (
            <Typography title={get(oriOption.data.data, optionLabel)}>
              {formatOptionLabel(oriOption.data.data)}
            </Typography>
          )
        }}
        {...restProps}
      />
    </Form.Item>
  )
}

export default React.memo(CoreAutocompleteAPI)
