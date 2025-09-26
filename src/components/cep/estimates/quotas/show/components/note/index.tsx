import { Card, Form } from 'antd'

function Note({ note }: { note: string }) {
  return (
    <Card
      title={'詳細情報'}
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
      <Form.Item>{note}</Form.Item>
    </Card>
  )
}

export default Note
