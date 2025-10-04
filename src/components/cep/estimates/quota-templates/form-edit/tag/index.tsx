import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Form, Select, Typography } from 'antd'

const { Title } = Typography

const TagForm: React.FC = () => {
  const t = useTranslate()
  const { selectProps } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
  })

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
          className="!w-96"
          allowClear
          showSearch
          placeholder={'選択してください'}
          mode="multiple"
          {...selectProps}
        />
      </Form.Item>
    </>
  )
}

export default TagForm
