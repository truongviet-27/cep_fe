import { Card, Col, Form, Row, Select } from 'antd'

function Tags() {
  return (
    <Card
      title={'タグ'}
      headStyle={{
        padding: 0,
        minHeight: 'none',
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
          <Form.Item>
            <Select
              allowClear
              showSearch
              placeholder={'選択してください'}
              style={{
                marginTop: 20,
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default Tags
