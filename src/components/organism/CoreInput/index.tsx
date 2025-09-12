import { cn } from '@utility/cn'
import { Form, Input, InputNumber } from 'antd'
import type { Rule } from 'antd/es/form'
import type { CSSProperties, ReactNode } from 'react'

function CoreInput({
  name,
  label,
  layout = 'vertical',
  placeholder,
  rules,
  isView,
  required = false,
  style,
  styleForm,
  classNameLabel,
  colon = false,
  type = 'text',
  icon,
  readOnly = false,
  ...field
}: {
  name?: string | (string | number)[]
  label?: ReactNode | string
  layout?: 'vertical' | 'horizontal'
  placeholder?: string
  rules?: Rule[]
  isView?: boolean
  required?: boolean
  style?: CSSProperties
  styleForm?: CSSProperties
  classNameLabel?: string
  type?: 'number' | 'text'
  colon?: boolean
  icon?: ReactNode
  readOnly?: boolean
}) {
  const Component = type === 'number' ? InputNumber : Input

  return (
    <Form.Item
      name={name}
      label={
        label && (
          <span className={cn('w-[200px] text-left', classNameLabel)}>
            {label}
            {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
          </span>
        )
      }
      shouldUpdate
      layout={layout}
      rules={rules}
      required={false}
      colon={colon}
      style={styleForm}
    >
      <Component
        placeholder={placeholder}
        readOnly={isView ?? readOnly}
        style={{
          ...style,
          ...(isView
            ? {
                background: 'transparent',
                paddingLeft: 0,
                color: 'inherit',
                border: 'none',
                boxShadow: 'none',
                cursor: 'default',
              }
            : {}),
        }}
        controls={false}
        suffix={icon}
        {...field}
      />
    </Form.Item>
  )
}

export default CoreInput
