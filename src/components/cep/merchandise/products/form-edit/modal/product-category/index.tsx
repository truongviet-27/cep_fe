/* eslint-disable */
import { useCreate, useTranslate } from '@refinedev/core'
import { Category } from '@utility/renderCategories'
import { Button, Divider, Flex, Form } from 'antd'
import React from 'react'

import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'

type Props = {
  modalProps: any
}

export const ProductCategoryModal: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, saveButtonProps, formLoading, form } = modalProps
  const { mutate: onCreateProductCategory, isPending: isLoadingSubmit } =
    useCreate({
      resource: 'product-categories',
    })

  const handleCreateCategory = (values: Category) => {
    onCreateProductCategory(
      {
        values: {
          name: values.name,
          parent_id: values?.parent_id,
          level: values?.parent_id ? (values?.level ?? 1) + 1 : 1,
        },
      },
      {
        onSuccess: () => {
          close()
        },
      },
    )
  }

  return (
    <Form
      {...formProps}
      layout="horizontal"
      style={{ maxWidth: 600 }}
      form={form}
      labelAlign="left"
      labelCol={{ span: 6 }}
      onFinish={handleCreateCategory}
    >
      <CoreInput
        label="分類名"
        name="name"
        required={true}
        layout="horizontal"
        placeholder="例: A34 消しゴム"
        rules={[
          {
            required: true,
            message: t('validation.required'),
          },
        ]}
      />
      <CoreInput name="parent_id" hidden />
      <CoreInput name="level" hidden />
      <div style={{ width: '100%', position: 'relative' }}>
        <Form.Item
          label={<span className="text-left font-bold">親カテゴリ</span>}
          name="parent"
          layout="horizontal"
          colon={false}
        >
          <ProductCategoryDropdown
            placeholder="例: 文房具 > 筆記用具"
            onSelect={(level, currentPath, currentCat, categoryId) => {
              form.setFieldValue('level', level)
              form.setFieldValue('parent_id', categoryId)
              form.setFieldValue('parent', currentPath.join(' > '))
            }}
          />
        </Form.Item>
      </div>
      <Divider />
      <Flex justify="end" gap="small">
        <Button onClick={close} color="primary" variant="outlined">
          {t('buttons.cancel')}
        </Button>
        <Button type="primary" htmlType="submit">
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </Form>
  )
}
