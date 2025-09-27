import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Col, Form, Row, Space, Tag } from 'antd'

function Tags({ tags }: { tags: { id: number; name: string }[] }) {
  return (
    <Card
      title={boldText('タグ', PRIMARY, 16)}
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
      <Row style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Form.Item name={'tags'}>
            <Space wrap>
              {tags?.map((item) => (
                <Tag
                  key={item.id}
                  style={{
                    borderRadius: '20px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    border: '2px solid #000',
                  }}
                >
                  {item.name}
                </Tag>
              ))}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default Tags
