/* eslint-disable */
import { useCreate, useTranslate } from '@refinedev/core'
import { Button, Form, Input, Space } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'
import { useForm } from '@refinedev/antd'

type Props = {
  modalProps: any
}

export const RankModalCreate: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()

  const { mutate } = useCreate({
    resource: 'ranks',
  })

  const { formProps, formLoading, saveButtonProps, form } = useForm({
    action: 'create',
    resource: 'ranks',
  })

  console.log('form', form.getFieldsValue())

  const { close } = modalProps

  return (
    <Create
      {...formProps}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
      title={<></>}
      i18nHeading={'code_issue_settings.edit.edit'}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
      >
        <Form.Item
          label={t('ranks.fields.code')}
          name="code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.rate')}
          name="rate"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.remarks')}
          name="remarks"
          rules={[{ required: true }]}
        >
          <Input multiple />
        </Form.Item>
      </Form>

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button
          {...saveButtonProps}
          type="primary"
          onClick={() => {
            mutate(form.getFieldsValue())
          }}
        >
          {t('products.buttons.save')}
        </Button>
      </Space>
    </Create>
  )
}
