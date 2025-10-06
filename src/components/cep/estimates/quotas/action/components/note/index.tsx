import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Form, Input } from 'antd'
import React from 'react'

function Note() {
  return (
    <Card
      title={boldText('仕様・条件', PRIMARY, 16)}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, minHeight: 0 },
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Form.Item name={'note'}>
        <Input.TextArea
          style={{ marginTop: 20 }}
          rows={6}
          className="!resize-none"
        />
      </Form.Item>
    </Card>
  )
}

export default Note
