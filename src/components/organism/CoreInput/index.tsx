/* eslint-disable @typescript-eslint/no-explicit-any */
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
  onChangeValue,
  children,
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
  onChangeValue?: (value: any) => void
  children?: ReactNode
}) {
  const Component = type === 'number' ? InputNumber : Input

  return (
    <Form.Item
      name={name}
      label={
        label && (
          <span className={cn('text-left font-bold', classNameLabel)}>
            {label}
          </span>
        )
      }
      shouldUpdate
      layout={layout}
      rules={rules}
      required={required}
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
        onChange={(value) => {
          if (onChangeValue) {
            onChangeValue(value as object)
          }
        }}
      />

      {children}
    </Form.Item>
  )
}

export default CoreInput
