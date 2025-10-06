import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { SEARCH_TIMEOUT } from '@utility/constant'
import { Empty, Form, Select, Spin, Typography } from 'antd'
import { debounce } from 'lodash'
import { useMemo, useState } from 'react'

const { Title } = Typography

const TagForm: React.FC = () => {
  const t = useTranslate()
  const [searchText, setSearchText] = useState('')
  const { selectProps } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
    filters: [
      {
        field: '_per_page',
        operator: 'eq',
        value: 30,
      },
      {
        field: 'name_lk',
        operator: 'eq',
        value: searchText,
      },
    ],
  })

  const debounceFetcher = useMemo(
    () => debounce(setSearchText, SEARCH_TIMEOUT),
    [],
  )

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mt-6 !mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleTag')}
      </Title>
      <Form.Item name="tags">
        <Select
          {...selectProps}
          className="!w-96"
          allowClear
          showSearch
          placeholder={'選択してください'}
          mode="multiple"
          onSearch={debounceFetcher}
          notFoundContent={
            selectProps.loading ? <Spin size="small" /> : <Empty />
          }
        />
      </Form.Item>
    </>
  )
}

export default TagForm
