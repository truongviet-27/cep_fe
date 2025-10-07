import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Form } from 'antd'

function Note({ note }: { note: string }) {
  return (
    <Card
      title={boldText('仕様・条件', PRIMARY, 16)}
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
      <Form.Item
        style={{
          padding: '0 10px',
        }}
      >
        {note}
      </Form.Item>
    </Card>
  )
}

export default Note
