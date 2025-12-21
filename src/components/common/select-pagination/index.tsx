/* eslint-disable */
import { useSelect } from '@refinedev/antd'
import type { UseSelectProps } from '@refinedev/core'
import { Form, FormItemProps, Select, SelectProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { get, uniqBy } from 'lodash' // Nhớ import uniqBy

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
      pageSize: 100,
      current: page,
      mode: 'server',
    },
    onSearch: (value) => {
      // setPage(1)
      // hasMore.current = true
      // setSearch(value)
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

    setOptions((prev) => {
      const merged = [...(prev || []), ...normalizedData]
      return uniqBy(merged, 'value')
    })

    if (data.length === 0 && page > 1) hasMore.current = false
  }, [query?.data])

  const isNotReady =
    options?.length === 0 || query.isLoading || query.fetchStatus === 'fetching'

  return (
    <Form.Item {...formItemProps}>
      {isNotReady ? (
        <div>
          <Select disabled {...selectComponentProps} placeholder="Loading..." />
        </div>
      ) : (
        <Select
          options={options}
          {...selectComponentProps}
          {...props}
          onSearch={props.onSearch} // Đảm bảo search hoạt động
          allowClear
          showSearch
          filterOption={false}
          onPopupScroll={(event) => {
            const target = event.currentTarget
            if (
              target.scrollTop + target.offsetHeight >=
              target.scrollHeight - 10
            ) {
              if (hasMore.current && !query.isFetching) {
                setPage((curr) => curr + 1)
              }
            }
          }}
        />
      )}
    </Form.Item>
  )
}
