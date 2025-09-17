/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Divider, Form, Input, Space } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'

type Props = {
  modalProps: any
}

export const CreateModal: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, saveButtonProps, formLoading } = modalProps

  return (
    <Create
      {...formProps}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
      title={<></>}
      i18nHeading={'ranks.create.create'}
    >
      <Form
        {...formProps}
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

        <Form.Item label={t('ranks.fields.remarks')} name="remarks">
          <Input />
        </Form.Item>
      </Form>

      <Divider />

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button {...saveButtonProps} type="primary">
          {t('buttons.save')}
        </Button>
      </Space>
    </Create>
  )
}
