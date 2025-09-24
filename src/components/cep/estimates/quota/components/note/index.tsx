import { Card, Input } from 'antd'
import React from 'react'

function Note() {
  return (
    <Card
      title={'詳細情報'}
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
      <Input.TextArea style={{ marginTop: 20 }} rows={5} />
    </Card>
  )
}

export default Note
