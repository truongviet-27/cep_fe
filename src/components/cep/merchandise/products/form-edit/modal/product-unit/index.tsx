/* eslint-disable */
import { useCreate, useTranslate } from '@refinedev/core'
import { Button, Flex, Form } from 'antd'
import React from 'react'

import CoreInput from '@components/common/core-input'
import { ProductUnit } from '@sdk/hey-api/types.gen'

type Props = {
  modalProps: any
  order: number
}

export const ProductUnitModal: React.FC<Props> = ({ modalProps, order }) => {
  const t = useTranslate()
  const { close, formProps, form } = modalProps
  const { mutate: createProductUnit, isPending: isLoadingSubmit } = useCreate({
    resource: 'product-units',
  })

  const handleCreateProductUnit = (values: ProductUnit) => {
    createProductUnit(
      {
        values: {
          name: values.name,
          order: order,
          is_disable: false,
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
      onFinish={handleCreateProductUnit}
    >
      <CoreInput
        label={t('products.fields.unit')}
        name="name"
        required={true}
        layout="horizontal"
        placeholder={t('products.fields.unit')}
        rules={[
          {
            required: true,
            message: t('products.fields.unit') + 'は必須です',
          },
        ]}
      />

      <Flex justify="end" gap="small">
        <Button onClick={close} color="primary" variant="outlined">
          {t('buttons.back')}
        </Button>
        <Button type="primary" htmlType="submit" loading={isLoadingSubmit}>
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </Form>
  )
}
