import { Form, Input } from 'antd'
import type { Rule } from 'antd/es/form'
import type { ReactNode } from 'react'

function CoreInput({
  name,
  label,
  layout = 'vertical',
  placeholder,
  rules,
}: {
  name: string
  label?: ReactNode | string
  layout?: 'vertical' | 'horizontal'
  placeholder?: string
  rules?: Rule[]
}) {
  return (
    <Form.Item name={name} label={label} layout={layout} rules={rules}>
      <Input placeholder={placeholder} />
    </Form.Item>
  )
}

export default CoreInput
