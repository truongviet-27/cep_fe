/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { Empty, Form, Select, Spin, Typography } from 'antd'
import { type DefaultOptionType, type SelectProps } from 'antd/es/select'
import { get, join } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type SelectPropsForm<
  ValueType = any,
  OptionType extends DefaultOptionType = DefaultOptionType,
> = SelectProps<ValueType, OptionType> & {
  name: any
  resource: string
  label?: React.ReactNode
  meta?: Record<string, any>
  optionLabel?: any
  optionValue?: any
  labelPathDisplay?: string[]
  required?: boolean
  rules?: any[]
  AutoCompleteClassName?: string
  labelInValue?: boolean
  layout?: 'vertical' | 'horizontal'
  colon?: boolean
  filter?: string
  pageSize?: number
  overwriteOptionsOnSearch?: boolean
  onChangeValue?: (value: any, option?: any) => void
  onChangeClear?: (fn: ((value: string) => void) | undefined) => void
  onSelect?: (value: any, option?: any) => void
  filters?: any
}

export const CoreAutocompleteAPI = (props: SelectPropsForm) => {
  const {
    name,
    resource,
    value,
    label,
    placeholder,
    optionLabel = 'name',
    optionValue = 'id',
    labelPathDisplay = [optionLabel],
    required,
    rules,
    mode,
    defaultValue,
    disabled = false,
    labelInValue = true,
    layout = 'vertical',
    colon = false,
    pageSize = 100,
    overwriteOptionsOnSearch = false,
    onChangeValue,
    onChangeClear,
    onSelect,
    filters,
    ...restProps
  } = props

  const [current, setCurrent] = useState(1)
  const [isClick, setIsClick] = useState(false)
  const [isPreApply, setIsPreApply] = useState(false)

  const [options, setOptions] = useState<any[]>([])

  const lastPageAdded = useRef(0)

  const { selectProps, query } = useSelect({
    resource,
    optionLabel,
    optionValue,
    meta: props.meta,
    filters: filters,
    pagination: {
      mode: 'server',
      current,
      pageSize,
    },
    queryOptions: {
      enabled: isClick && !disabled,
    },
    onSearch(value) {
      lastPageAdded.current = 0
      setIsPreApply(false)
      setCurrent(1)
      const searchFilters = value ? [{ field: 'q', operator: 'eq', value }] : []
      return [...(filters || []), ...searchFilters]
    },
  })

  const stringifiedFilters = JSON.stringify(filters)
  useEffect(() => {
    setOptions([])
    setCurrent(1)
    lastPageAdded.current = 0
  }, [stringifiedFilters])

  useEffect(() => {
    if (query.data?.data && current > lastPageAdded.current) {
      const newData = query.data.data

      setOptions((prev) => {
        if (overwriteOptionsOnSearch) {
          return newData
        }
        return [...(isPreApply ? prev : []), ...newData]
      })

      lastPageAdded.current = current
    }
  }, [query.data?.data])

  useEffect(() => {
    if (
      defaultValue &&
      typeof defaultValue === 'object' &&
      defaultValue.value &&
      defaultValue.label
    ) {
      const newOption = {
        [optionValue]: defaultValue.value,
        [optionLabel]: defaultValue.label,
      }
      setOptions((prev) => {
        const isExist = prev.some(
          (opt) => opt[optionValue] === newOption[optionValue],
        )
        return isExist ? prev : [newOption, ...prev]
      })
    }
  }, [defaultValue?.value, defaultValue?.label])

  const handlePopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (
        scrollTop + clientHeight >= scrollHeight - 30 &&
        !query.isFetching &&
        (query.data?.total ?? 0) > options.length
      ) {
        setIsPreApply(true)
        setCurrent((prev) => prev + 1)
      }
    },
    [options, query.isFetching, query.data?.total],
  )

  const formatOptionLabel = (option: any) =>
    join(
      labelPathDisplay.map((key: string) => get(option, key)),
      ' - ',
    )

  return (
    <Form.Item
      name={name}
      required={required}
      label={label}
      rules={rules}
      layout={layout}
      colon={colon}
      className="ant-form-item-hidden-margin"
      initialValue={defaultValue}
    >
      <Select
        {...selectProps}
        options={options.map((opt) => ({
          label: get(opt, optionLabel),
          value: get(opt, optionValue),
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
          if (onChangeValue) {
            const valueOption = options.find(
              (opt) => opt?.id === (labelInValue ? value?.value : value),
            )
            onChangeValue(valueOption)
          }
          if (onChangeClear) {
            onChangeClear(selectProps.onSearch)
          }
          if (value) {
            if (selectProps?.onSearch) selectProps.onSearch('')
          }
        }}
        onSelect={(value, option) => {
          if (onSelect) {
            const valueOption = options.find(
              (opt) => opt?.id === (labelInValue ? value?.value : value),
            )
            onSelect(valueOption, option)
          }
        }}
        value={value}
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
