/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Form, Input, InputNumber, Row, Space, Typography } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'
import { CreateButton, useForm } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { validateRankRule } from '@validate/rank'

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
        <Form.Item required label={boldText(t('ranks.fields.code'))}>
          <Row>
            <Form.Item required name="code" rules={[validateRankRule(t)]}>
              <Input style={{ width: '105%' }} />
            </Form.Item>
            <Typography.Text className={'mt-1 ml-10'} type="secondary">
              (A-Z, 0-9, -)
            </Typography.Text>
          </Row>
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[validateRankRule(t)]}
          style={{ marginTop: -20 }}
        >
          <Input style={{ width: '50%' }} />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[validateRankRule(t)]}
        >
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.remarks'))}
          name="note"
          rules={[validateRankRule(t)]}
        >
          <Input multiple />
        </Form.Item>
      </Form>
    </Create>
  )
}
