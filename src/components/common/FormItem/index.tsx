import requiredLabel from '@utility/required-label'
import { Form } from 'antd'
import React, { type CSSProperties, type ReactNode } from 'react'

function FormItem({
  children,
  label,
  layout = 'horizontal',
  style,
  required = false,
}: {
  children: ReactNode
  label?: string | ReactNode
  layout?: 'horizontal' | 'vertical'
  style?: CSSProperties
  required?: boolean
}) {
  return (
    <Form.Item
      layout={layout}
      label={label && required ? requiredLabel(label) : label}
      style={{ marginBottom: 0, ...style }}
      required={required}
    >
      {children}
    </Form.Item>
  )
}

export default FormItem
