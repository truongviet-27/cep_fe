import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Col, Form, Row, Select } from 'antd'

function Tags() {
  const t = useTranslate()
  const { selectProps } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    onSearch(value) {
      return [
        {
          field: 'name',
          operator: 'contains',
          value,
        },
      ]
    },
  })

  return (
    <Card
      title={boldText(t('quotas.show.tags'), PRIMARY, 16)}
      styles={{
        header: {
          padding: 0,
          minHeight: 0,
        },
        body: { padding: 0 },
      }}
      style={{
        border: 'none',
        marginTop: 20,
      }}
    >
      <Row>
        <Col xs={12} md={6}>
          <Form.Item name={'tags'}>
            <Select
              allowClear
              showSearch
              placeholder={t('placeholders.select')}
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
    </Card>
  )
}

export default Tags
