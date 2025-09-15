/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Form, Input, Select } from 'antd'
import React from 'react'

type Props = {
  modalProps: any
}

export const ProductCategoryModal: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, saveButtonProps, formLoading, form } = modalProps

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="分類名"
        name="name"
        rules={[{ required: true, message: '必須項目です' }]}
      >
        <Input placeholder="例: A34 消しゴム" />
      </Form.Item>

      <Form.Item label="親カテゴリ" name={['parent', 'id']}>
        <Select
          showSearch
          placeholder="親カテゴリを選択"
          options={[
            { label: '文房具', value: 1 },
            { label: '雑貨', value: 2 },
          ]}
        />
      </Form.Item>
    </Form>
  )
}
