import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Col, Form, Row, Select, Typography } from 'antd'

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
      <Row>
        <Col xs={12} md={6}>
          <Form.Item name={'tags'}>
            <Select
              allowClear
              showSearch
              placeholder={'選択してください'}
              style={{
                marginTop: 20,
                width: '100%',
              }}
              labelInValue
              mode="multiple"
              {...selectProps}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default TagForm
