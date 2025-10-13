import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Form, Input } from 'antd'
import React from 'react'

function Note() {
  const t = useTranslate()
  return (
    <Card
      title={boldText(
        t('quotas.action.specifications_conditions'),
        PRIMARY,
        16,
      )}
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
          placeholder={t('quotas.action.placeholders.enter_note')}
        />
      </Form.Item>
    </Card>
  )
}

export default Note
