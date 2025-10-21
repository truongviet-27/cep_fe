import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Col, Form, Row, Space, Tag } from 'antd'

function Tags({ tags }: { tags: { id: number; name: string }[] }) {
  const t = useTranslate()
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
