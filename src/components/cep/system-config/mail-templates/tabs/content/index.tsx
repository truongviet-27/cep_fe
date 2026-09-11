/* eslint-disable simple-import-sort/imports */
import { useTranslate } from '@refinedev/core'
import type { InputRef } from 'antd'
import { Button, Form, Input, Space, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useRef, useState } from 'react'
import './style-email.css'
import boldText from '@utility/bold-text'
import requiredLabel from '@utility/required-label'

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
  const [focusedEl, setFocusedEl] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null)
  const [focusFieldName, setFocusFieldName] = useState<string>('')
  const t = useTranslate()

  const methods = Form.useFormInstance()
  const { getFieldValue, setFieldValue } = methods

  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setFocusedEl(e.target ?? e.currentTarget)
    setFocusFieldName(field)
  }

  const insertAtCursorTextarea = (field: string, text: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputEl = (focusedEl as any)?.resizableTextArea?.textArea || focusedEl
    if (!inputEl) return

    const prevScrollTop = inputEl.scrollTop
    const currentValue = getFieldValue(field) || ''
    const start = inputEl.selectionStart ?? currentValue.length
    const end = inputEl.selectionEnd ?? currentValue.length

    const cleanText = text.trim()
    const insertValue = `[[${cleanText}]]`

    const newValue =
      currentValue.substring(0, start) +
      insertValue +
      currentValue.substring(end)

    setFieldValue(field, newValue)

    setTimeout(() => {
      inputEl.focus()
      const cursorPos = start + insertValue.length
      inputEl?.setSelectionRange(cursorPos, cursorPos)
      inputEl.scrollTop = prevScrollTop
    })
  }

  return loading ? (
    <div className="text-center">
      <Spin size={'large'} />
    </div>
  ) : (
    <div className="mail-template-content">
      <Form.Item
        layout="vertical"
        name={`title_${index}`}
        label={boldText(
          isEdit
            ? requiredLabel(t('mail_templates.form.subject'))
            : t('mail_templates.form.subject'),
        )}
        required={isEdit}
        rules={
          isEdit
            ? [
                {
                  required: true,
                  message: t('mail_templates.validation.title.required'),
                },
                {
                  max: 255,
                  message: t('mail_templates.validation.title.max255'),
                },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.title.notBlank'),
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
            {boldText(
              isEdit
                ? requiredLabel(t('mail_templates.form.body'))
                : t('mail_templates.form.body'),
            )}
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
                      const field = focusFieldName || `content_${index}`
                      const textToInsert = field.startsWith('signature_')
                        ? tag.text
                        : tag.text + '\n'
                      insertAtCursorTextarea(field, textToInsert)
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
                  message: t('mail_templates.validation.body.required'),
                },
                {
                  max: 10000,
                  message: t('mail_templates.validation.body.max10000'),
                },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.body.notBlank'),
                },
              ]
            : []
        }
      >
        <TextArea
          rows={15}
          name={`content_${index}`}
          variant={isEdit ? 'outlined' : 'borderless'}
          readOnly={!isEdit}
          ref={inputRef}
          onFocus={(e) => onFocus(e, `content_${index}`)}
        />
      </Form.Item>

      <Form.Item
        layout="vertical"
        name={`signature_${index}`}
        label={boldText(
          isEdit
            ? requiredLabel(t('mail_templates.form.signature.label'))
            : t('mail_templates.form.signature.label'),
        )}
        required={isEdit}
        rules={
          isEdit
            ? [
                {
                  required: true,
                  message: t('mail_templates.validation.signature.required'),
                },
                {
                  max: 1000,
                  message: t('mail_templates.validation.signature.max1000'),
                },
                {
                  pattern: /^(?!\s*$).+/,
                  message: t('mail_templates.validation.signature.notBlank'),
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
          onFocus={(e) => onFocus(e, `signature_${index}`)}
        />
      </Form.Item>
    </div>
  )
}

export default TabsContent
