import { useSelect } from '@refinedev/antd'
import { Card, Col, Form, Row, Select } from 'antd'

function Tags() {
  const { selectProps } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
  })

  return (
    <Card
      title={'タグ'}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
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
    </Card>
  )
}

export default Tags
