/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Form, Select } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { useEffect, useMemo, useState } from 'react'

function CoreAutoComplete({
  nameFilter,
  filterPath,
  resource,
  onChange,
  style,
  labelPath = 'name',
  valuePath = 'id',
  params,
  excludeIds = [],
  watchPath,
  currentIndex,
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
  excludeIds?: (number | string)[]
  watchPath?: any
  currentIndex?: number
}) {
  const t = useTranslate()

  const form = useFormInstance()

  const filter = Form.useWatch(filterPath, form)
  const watchedValue = Form.useWatch(watchPath, form)
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  // Serialize watchedValue to string for stable comparison
  const watchedValueString = useMemo(() => {
    if (watchedValue && Array.isArray(watchedValue)) {
      return JSON.stringify(watchedValue.map((emp: any) => emp?.employee_id))
    }
    return ''
  }, [watchedValue])

  // Memoize the selected employee IDs to prevent infinite loop
  const selectedEmployeeIds = useMemo(() => {
    if (watchPath && watchedValue && Array.isArray(watchedValue)) {
      return watchedValue
        .map((emp: any, idx: number) =>
          idx !== currentIndex ? emp?.employee_id : null,
        )
        .filter((id: any) => id !== null && id !== undefined)
    }
    return excludeIds
  }, [watchPath, watchedValueString, currentIndex, excludeIds])

  const baseFilters = filter
    ? [{ field: nameFilter, operator: 'eq', value: filter }]
    : []

  const additionalFilters = params?.filters || []
  const allFilters = [...baseFilters, ...additionalFilters]

  const { selectProps, query } = useSelect({
    resource: resource,
    optionValue: valuePath,
    optionLabel: labelPath,
    filters: allFilters,
    queryOptions: {
      enabled: !!filterPath && !!filter,
    },
  })

  useEffect(() => {
    if (query.data?.data) {
      let result = query.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      })) as any

      if (selectedEmployeeIds.length > 0) {
        result = result.filter(
          (opt: any) => !selectedEmployeeIds.includes(opt.value),
        )
      }

      setOptions(result)
    }
  }, [query.data?.data, JSON.stringify(selectedEmployeeIds)])

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
