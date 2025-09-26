import { Card, Form, Input } from 'antd'
import React from 'react'

function Note() {
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
