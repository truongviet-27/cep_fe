/* eslint-disable */
import { useSelect } from '@refinedev/antd'
import type { UseSelectProps } from '@refinedev/core'
import { Form, FormItemProps, Select, SelectProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { get, uniqBy } from 'lodash' // Nhớ import uniqBy

type Props = {
  selectProps: UseSelectProps<any, any, any>
  disabled?: boolean
  selectComponentProps: SelectProps
  formItemProps?: FormItemProps
  optionLabel?: any
  optionValue?: any
  fieldSearch?: string
  allowClear?: boolean
}

export const SelectPagination = ({
  disabled = false,
  selectComponentProps,
  selectProps,
  formItemProps,
  optionLabel = 'name',
  optionValue = 'id',
  fieldSearch = 'q',
  allowClear = true,
}: Props) => {
  const [page, setPage] = useState<number>(1)
  const [options, setOptions] = useState<SelectProps['options']>([])
  const hasMore = useRef(true)
  const isScrollPage = useRef(false)
  const { selectProps: props, query } = useSelect({
    ...selectProps,
    optionLabel,
    optionValue,
    pagination: {
      pageSize: 100,
      current: page,
      mode: 'server',
    },
    onSearch: (value) => {
      isScrollPage.current = false
      setPage(1)
      hasMore.current = true
      if (!value) return []
      return [
        {
          field: fieldSearch,
          operator: 'eq',
          value,
        },
      ]
    },
  })

  useEffect(() => {
    const data = query?.data
    if (!data?.data?.length) {
      hasMore.current = false
      return
    }

    const normalizedData = data.data.map((item: any) => ({
      label: get(item, optionLabel),
      value: get(item, optionValue),
    }))

    setOptions((prev) =>
      isScrollPage.current
        ? uniqBy([...(prev || []), ...normalizedData], 'value')
        : uniqBy(normalizedData, 'value'),
    )
  }, [query?.data])

  return (
    <Form.Item {...formItemProps}>
      <Select
        disabled={disabled}
        {...selectComponentProps}
        {...props}
        options={options}
        loading={query.isFetching}
        onSearch={props.onSearch}
        allowClear={allowClear}
        showSearch
        filterOption={false}
        onChange={(value, option) => {
          selectComponentProps.onChange?.(value, option)
          props.onSearch?.('')
        }}
        onPopupScroll={(event) => {
          const target = event.currentTarget
          if (
            target.scrollTop + target.offsetHeight >=
            target.scrollHeight - 10
          ) {
            if (hasMore.current && !query.isFetching) {
              isScrollPage.current = true
              setPage((curr) => curr + 1)
            }
          }
        }}
      />
    </Form.Item>
  )
}
