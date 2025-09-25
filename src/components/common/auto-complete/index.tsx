/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Form, Select } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'

function CoreAutoComplete({
  nameFilter,
  filterPath,
  resource,
  onChange,
  style,
  labelPath = 'name',
  valuePath = 'id',
  ...rest
}: {
  nameFilter: string
  resource: string
  onChange?: (val: any) => void
  style?: React.CSSProperties
  filterPath?: any
  labelPath?: any
  valuePath?: any
}) {
  const t = useTranslate()

  const form = useFormInstance()

  const filter = Form.useWatch(filterPath, form)

  const { selectProps } = useSelect({
    resource: resource,
    optionValue: valuePath,
    optionLabel: labelPath,
    filters: filter
      ? [{ field: nameFilter, operator: 'eq', value: filter }]
      : [],
    queryOptions: {
      enabled: !!filter,
    },
    pagination: {
      mode: 'off',
    },
    onSearch: (value) => {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  return (
    <Select
      {...selectProps}
      {...rest}
      style={style}
      showSearch
      placeholder={t('placeholders.select')}
      filterOption={false}
      autoClearSearchValue
      allowClear
      onChange={onChange}
      disabled={!filter}
    />
  )
}

export default CoreAutoComplete
