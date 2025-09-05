import './styleEmail.css'

import type { InputRef } from 'antd'
import { Button, Form, Input, Space, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

function TabsContent({
  index,
  isEdit,
  tags,
  loading,
}: {
  index: number
  isEdit: boolean
  tags: { value: number; text: string }[]
  loading: boolean
}) {
  const methods = useFormContext()
  const { control, getValues, setValue } = methods

  const inputRef = useRef<InputRef>(null)

  const insertAtCursor = (field: string, text: string) => {
    const input = inputRef.current?.resizableTextArea?.textArea
    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = getValues(field) || ''

    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end)

    setValue(field, newValue)

    setTimeout(() => {
      input.focus()
      input.selectionStart = input.selectionEnd = start + text.length
    })
  }

  return loading ? (
    <div className="text-center">
      <Spin size={'large'} />
    </div>
  ) : (
    <Form layout="vertical" {...methods}>
      <Form.Item
        layout="vertical"
        name={`title_${index}`}
        label={<span style={{ fontWeight: 'bold' }}>件名</span>}
        rules={[{ required: true }]}
      >
        <Controller
          name={`title_${index}`}
          control={control}
          render={({ field }) => {
            return (
              <Input
                variant={isEdit ? 'outlined' : 'borderless'}
                readOnly={!isEdit}
                {...field}
              />
            )
          }}
        />
      </Form.Item>
      <Form.Item
        name={`content_${index}`}
        label={
          <>
            <span style={{ fontWeight: 'bold' }}>本文</span>
            {isEdit && (
              <Space
                style={{
                  flexWrap: 'wrap',
                  float: 'right',
                  marginRight: '0',
                  marginLeft: 'auto',
                }}
              >
                {tags.map((tag) => (
                  <Button
                    key={tag.value}
                    size="small"
                    style={{
                      border: '1px solid #91D5FF',
                      backgroundColor: '#E6F7FF',
                      color: '#1890FF',
                    }}
                    onClick={() => {
                      insertAtCursor(`content_${index}`, tag.text + '\n')
                    }}
                  >
                    {tag.text}
                  </Button>
                ))}
              </Space>
            )}
          </>
        }
        rules={[{ required: true }]}
      >
        <Controller
          name={`content_${index}`}
          control={control}
          render={({ field }) => {
            return (
              <TextArea
                rows={8}
                variant={isEdit ? 'outlined' : 'borderless'}
                className="!resize-none"
                readOnly={!isEdit}
                {...field}
                ref={inputRef}
              />
            )
          }}
          rules={{
            required: {
              value: true,
              message: 'hello anh em',
            },
          }}
        />
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={<span style={{ fontWeight: 'bold' }}>署名（自動挿入）</span>}
      >
        <Controller
          name={`signature_${index}`}
          control={control}
          render={({ field }) => {
            return (
              <TextArea
                rows={4}
                variant={isEdit ? 'outlined' : 'borderless'}
                className="!resize-none"
                readOnly={!isEdit}
                {...field}
              />
            )
          }}
          rules={{
            required: true,
          }}
        />
      </Form.Item>
    </Form>
  )
}

export default TabsContent
