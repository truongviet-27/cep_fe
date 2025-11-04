/* eslint-disable @typescript-eslint/no-explicit-any */
import boldText from '@utility/bold-text'
import { Form, Input, InputNumber } from 'antd'
import type { Rule } from 'antd/es/form'
import type { ColProps } from 'antd/lib'
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
  colon = false,
  type = 'text',
  icon,
  readOnly = false,
  hidden = false,
  onChangeValue,
  children,
  labelCol,
  wrapperCol,
  classNameInput,
  className,
  disabled = false,
  defaultValue,
  value,
  initialValue,
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
  hidden?: boolean
  onChangeValue?: (value: any) => void
  children?: ReactNode
  labelCol?: ColProps
  wrapperCol?: ColProps
  classNameInput?: string
  className?: string
  disabled?: boolean
  defaultValue?: any
  value?: any
  initialValue?: any
}) {
  const Component = type === 'number' ? InputNumber : Input

  return (
    <Form.Item
      name={name}
      label={label ? boldText(label) : undefined}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      shouldUpdate
      layout={layout}
      required={required}
      rules={rules}
      colon={colon}
      style={styleForm}
      hidden={hidden}
      className={className}
      initialValue={initialValue}
    >
      <Component
        className={classNameInput}
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
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
      />

      {children}
    </Form.Item>
  )
}

export default CoreInput
