/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Form, Input, Space } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'
import { CreateButton, useForm } from '@refinedev/antd'
import boldText from '@utility/bold-text'

type Props = {
  modalProps: any
}

export const RankModalCreate: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()

  const { formProps, formLoading, saveButtonProps, form } = useForm({
    action: 'create',
    resource: 'ranks',
  })

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
        {...formProps}
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        onFinish={close}
      >
        <Form.Item
          label={boldText(t('ranks.fields.code'))}
          name="code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.remarks'))}
          name="note"
          rules={[{ required: true }]}
        >
          <Input multiple />
        </Form.Item>
      </Form>

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <CreateButton {...saveButtonProps} type="primary">
          {t('products.buttons.save')}
        </CreateButton>
      </Space>
    </Create>
  )
}
