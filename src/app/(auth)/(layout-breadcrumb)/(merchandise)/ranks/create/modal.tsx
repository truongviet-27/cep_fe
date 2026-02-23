/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Flex, Form, Input, InputNumber, Space } from 'antd'
import React from 'react'
import { Create } from '@components/crud/create'
import { CreateButton, useForm } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { validateRankRule } from '@validate/rank'
import AutoHeading from '@components/common/auto-heading'

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
    const result: any = await formProps.onFinish?.(values)
    if (result?.data) {
      form.resetFields()
      close()
    }
    return result
  }

  return (
    <Create
      {...formProps}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={<></>}
      contentProps={{ style: { boxShadow: 'none' } }}
      rightFooterButtons={
        <Space className={'flex w-full justify-end'}>
          <Button
            onClick={() => {
              close()
              form.resetFields()
            }}
          >
            {t('buttons.cancel')}
          </Button>
          <CreateButton {...saveButtonProps} type="primary" icon={null}>
            {t('buttons.create')}
          </CreateButton>
        </Space>
      }
      hiddenButtonBack
      isAutoHeading={false}
    >
      <AutoHeading className={'!-mt-8'} i18n={'ranks.create.create'} />

      <Form
        className={'!mt-10'}
        {...formProps}
        layout="horizontal"
        labelCol={{ span: 8 }}
        labelAlign="left"
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item required label={boldText(t('ranks.fields.code'))}>
          <Flex>
            <Form.Item
              required
              name="code"
              rules={[validateRankRule(t)]}
              style={{ maxWidth: '180px' }}
            >
              <Input />
            </Form.Item>
            &nbsp;
            <div className={'mt-1'}>{t('products.validation.codeFormat')}</div>
          </Flex>
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[validateRankRule(t)]}
          style={{ marginTop: -12 }}
        >
          <Input style={{ width: '50%' }} />
        </Form.Item>

        <Form.Item
          required
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[validateRankRule(t)]}
        >
          <InputNumber style={{ width: '50%' }} min={0} max={100} />
        </Form.Item>

        <Form.Item
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
