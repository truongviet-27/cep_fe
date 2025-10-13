import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'

function Reason() {
  const t = useTranslate()
  return (
    <Card
      title={boldText(t('quotas.show.rejection_reason'), PRIMARY, 16)}
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
        name={'reason'}
        style={{ marginTop: 20 }}
        rules={[
          {
            required: true,
            message: t('validation.required'),
          },
          {
            whitespace: true,
            message: t(t('validation.invalid_format')),
          },
        ]}
      >
        <TextArea rows={6} className="!resize-none" />
      </Form.Item>
    </Card>
  )
}

export default Reason
