/* eslint-disable simple-import-sort/imports */
import { useTranslate } from '@refinedev/core'
import type { InputRef } from 'antd'
import { Button, Form, Input, Space, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useRef } from 'react'
import './style-email.css'
import boldText from '@utility/bold-text'

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
  const t = useTranslate()

  const methods = Form.useFormInstance()
  const { getFieldValue, setFieldValue } = methods

  const insertAtCursor = (field: string, text: string) => {
    const input = inputRef.current?.resizableTextArea?.textArea
    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = getFieldValue(field) || ''

    const cleanText = text.trim()
    const insertValue = `[[${cleanText}]]`

    const newValue =
      currentValue.substring(0, start) +
      `[[${text.trim()}]]` +
      currentValue.substring(end)

    setFieldValue(field, newValue)

    setTimeout(() => {
      input.focus()
      const cursorPos = start + insertValue.length
      input.setSelectionRange(cursorPos, cursorPos)
      input.scrollTop = input.scrollHeight
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
        label={boldText(t('mail_templates.form.subject'))}
        required={isEdit}
        rules={
          isEdit
            ? [
                {
                  required: true,
                  message: t('mail_templates.validation.required'),
                },
                { max: 255, message: t('mail_templates.validation.max255') },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.notBlank'),
                },
              ]
            : []
        }
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
        required={isEdit}
        label={
          <>
            {boldText(t('mail_templates.form.body'))}
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
        rules={
          isEdit
            ? [
                {
                  required: true,
                  message: t('mail_templates.validation.required'),
                },
                { max: 255, message: t('mail_templates.validation.max255') },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.notBlank'),
                },
              ]
            : []
        }
      >
        <TextArea
          rows={8}
          name={`content_${index}`}
          variant={isEdit ? 'outlined' : 'borderless'}
          readOnly={!isEdit}
          ref={inputRef}
        />
      </Form.Item>

      <Form.Item
        layout="vertical"
        name={`signature_${index}`}
        label={boldText(t('mail_templates.form.signature.label'))}
        required={isEdit}
        rules={
          isEdit
            ? [
                {
                  required: true,
                  message: t('mail_templates.validation.required'),
                },
                { max: 255, message: t('mail_templates.validation.max255') },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.notBlank'),
                },
              ]
            : []
        }
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
