import './styleEmail.css'

import type { InputRef } from 'antd'
import { Button, Form, Input, Space, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useRef } from 'react'

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
  const inputRef = useRef<
    InputRef & {
      resizableTextArea?: {
        textArea: HTMLTextAreaElement
      }
    }
  >(null)
  const methods = Form.useFormInstance()
  const { getFieldValue, setFieldValue } = methods

  const insertAtCursor = (field: string, text: string) => {
    const input = inputRef.current?.resizableTextArea?.textArea
    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = getFieldValue(field) || ''

    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end)

    setFieldValue(field, newValue)

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
    <>
      <Form.Item
        layout="vertical"
        name={`title_${index}`}
        label={<span style={{ fontWeight: 'bold' }}>件名</span>}
        rules={[
          { required: true, message: '必須項目です' },
          { max: 255, message: '255文字以内で入力してください' },
          {
            pattern: /^(?!\s*$).+/,
            message: '空白だけの入力はできません',
          },
        ]}
      >
        <Input
          variant={isEdit ? 'outlined' : 'borderless'}
          readOnly={!isEdit}
          name={`title_${index}`}
        />
      </Form.Item>

      <Form.Item
        name={`content_${index}`}
        layout="vertical"
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
        rules={[
          { required: true, message: '必須項目です' },
          { max: 255, message: '255文字以内で入力してください' },
          {
            pattern: /^(?!\s*$).+/,
            message: '空白だけの入力はできません',
          },
        ]}
      >
        <TextArea
          rows={8}
          name={`content_${index}`}
          variant={isEdit ? 'outlined' : 'borderless'}
          className="!resize-none"
          readOnly={!isEdit}
          ref={inputRef}
        />
      </Form.Item>

      <Form.Item
        layout="vertical"
        name={`signature_${index}`}
        label={<span style={{ fontWeight: 'bold' }}>署名（自動挿入）</span>}
        rules={[
          { required: true, message: '必須項目です' },
          { max: 255, message: '255文字以内で入力してください' },
          {
            pattern: /^(?!\s*$).+/,
            message: '空白だけの入力はできません',
          },
        ]}
      >
        <TextArea
          rows={4}
          name={`signature_${index}`}
          variant={isEdit ? 'outlined' : 'borderless'}
          className="!resize-none"
          readOnly={!isEdit}
        />
      </Form.Item>
    </>
  )
}

export default TabsContent
