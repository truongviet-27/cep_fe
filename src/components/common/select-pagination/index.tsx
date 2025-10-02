/* eslint-disable */
import { useSelect } from '@refinedev/antd'
import type { UseSelectProps } from '@refinedev/core'
import { Form, FormItemProps, Select, SelectProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { get } from 'lodash'

type Props = {
  selectProps: UseSelectProps<any, any, any>
  selectComponentProps: SelectProps
  formItemProps?: FormItemProps
  optionLabel?: any
  optionValue?: any
  fieldSearch?: string
}

export const SelectPagination = ({
  selectComponentProps,
  selectProps,
  formItemProps,
  optionLabel = 'name',
  optionValue = 'id',
  fieldSearch = 'q',
}: Props) => {
  const [page, setPage] = useState<number>(1)
  const [options, setOptions] = useState<SelectProps['options']>([])
  const [search, setSearch] = useState<string>('')
  const hasMore = useRef(true)
  const { selectProps: props, query } = useSelect({
    ...selectProps,
    optionLabel,
    optionValue,
    pagination: {
      pageSize: 20,
      current: page,
      mode: 'server',
    },
    onSearch: (value) => {
      setPage(1)
      hasMore.current = true
      setSearch(value)
      return [
        {
          field: fieldSearch,
          operator: 'null',
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

    const normalizedData = data.data?.map((item: any) => ({
      label: get(item, optionLabel),
      value: get(item, optionValue),
    }))

    if (!search?.length) {
      setOptions((prev) => {
        const merged = [...(prev || []), ...normalizedData]
        // Loại bỏ trùng lặp theo value
        return Array.from(
          new Map(merged.map((item) => [item.value, item])).values(),
        )
      })
    } else {
      setOptions(normalizedData)
    }
  }, [query?.data, search])

  return (
    <Form.Item {...formItemProps}>
      <Select
        options={options}
        {...selectComponentProps}
        {...props}
        allowClear
        showSearch
        filterOption={false}
        onPopupScroll={(event) => {
          const target = event.currentTarget
          if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (props.options && hasMore.current) {
              setPage((curr) => curr + 1)
            }
          }
        }}
      />
    </Form.Item>
  )
}
