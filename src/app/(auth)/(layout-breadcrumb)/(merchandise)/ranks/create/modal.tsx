/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Form, Input, Space } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'
import { CreateButton, useForm } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { createSchemaFieldRule } from 'antd-zod'
import { zRank } from '@sdk/hey-api/zod.gen'

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

  const handleFinish = async (values: any) => {
    const result = await formProps.onFinish?.(values)
    form.resetFields()
    close()
    return result
  }

  const rule = createSchemaFieldRule(zRank)

  return (
    <Create
      {...formProps}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={<></>}
      i18nHeading={'ranks.create.create'}
      contentProps={{ style: { boxShadow: 'none' } }}
      rightFooterButtons={
        <Space className={'flex w-full justify-end'}>
          <Button onClick={close}>{t('buttons.cancel')}</Button>
          <CreateButton {...saveButtonProps} type="primary" icon={null}>
            {t('buttons.create')}
          </CreateButton>
        </Space>
      }
      hiddenButtonBack
    >
      <Form
        {...formProps}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label={boldText(t('ranks.fields.code'))}
          name="code"
          required
          rules={[rule]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[rule]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[rule]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.remarks'))}
          name="note"
          rules={[rule]}
        >
          <Input multiple />
        </Form.Item>
      </Form>
    </Create>
  )
}
