import { useTranslate } from '@refinedev/core'
import { Form, Input, InputNumber } from 'antd'
import React from 'react'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  inputType: 'number' | 'text'
  index: number
  style?: React.CSSProperties
}

export const EditableCell: React.FC<
  React.PropsWithChildren<EditableCellProps>
> = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  const t = useTranslate()

  return (
    <td
      {...restProps}
      style={{
        textAlign: 'center',
        ...restProps.style,
        padding: 11,
      }}
    >
      {editing ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
              message: t('validation.required'),
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}
