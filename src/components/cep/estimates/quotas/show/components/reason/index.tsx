import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'

function Reason() {
  return (
    <Card
      title={boldText('差戻の理由', PRIMARY, 16)}
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
      <Form.Item name={'reason'} style={{ marginTop: 20 }}>
        <TextArea rows={6} className="!resize-none" />
      </Form.Item>
    </Card>
  )
}

export default Reason
