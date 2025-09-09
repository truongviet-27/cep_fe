/* eslint-disable */
import HashDashIcon from '@components/icons/hash-dash-icon'
import { useTranslate } from '@refinedev/core'
import { segmentOptions } from '@utility/options'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'

type Props = {
  modalProps: any
}

export const CodeIssueSettingEdit: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading } =
    modalProps

  const record = queryResult?.data?.data

  const issueMethod = Form.useWatch('issue_method', formProps.form)
  const hashDashVal = Form.useWatch('hash_dash', formProps.form)
  const isManual = issueMethod === 'manual'

  console.log(record, 'hashDashVal')

  return (
    <Edit
      {...formProps}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
      title={<></>}
    >
      <Form
        initialValues={{
          hash_dash: false,
          ...record,
        }}
        {...formProps}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        // onFinish={async (values) => {
        //   const result = await onFinish(values)
        //   if (result) {
        //     close()
        //   }
        // }}
      >
        <Form.Item
          label={t('code_issue_settings.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          {record?.name}
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.issue_method')}
          name="issue_method"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="manual">
              {t('code_issue_settings.fields.enum_issue.manual')}
            </Radio>
            <Radio value="automatic">
              {t('code_issue_settings.fields.enum_issue.automatic')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.prefix')}
          name="prefix"
          rules={[{ required: true }]}
        >
          <Input placeholder="例: PD" disabled={isManual} />
        </Form.Item>

        <Form.Item
          label={<HashDashIcon />}
          valuePropName="checked"
          name="hash_dash"
        >
          <Checkbox disabled={isManual} />
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <Typography.Text>(ハイフンを入れる)</Typography.Text>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.segment')}
          name="segment"
          rules={[{ required: true }]}
        >
          <Select options={segmentOptions} disabled={isManual} />
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.serial_length')}
          name="serial_length"
          rules={[{ required: true }]}
        >
          <Select disabled={isManual}>
            {[...Array(10)].map((_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('code_issue_settings.fields.total')} name="total">
          {record?.total}
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.preview_code')}
          name="preview_code"
        >
          <Tag>{record?.preview_code}</Tag>
        </Form.Item>

        <Divider />

        <Form.Item
          label={t('code_issue_settings.fields.created_by')}
          colon={false}
        >
          <Typography.Text type="secondary">
            {record?.author} {record?.author && '---'}
            {record?.created_at
              ? dayjs(record.created_at).format('DD/MM/YYYY HH:mm')
              : ''}
          </Typography.Text>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.updated_by')}
          colon={false}
        >
          <Typography.Text type="secondary">
            {record?.editor} {record?.editor && '---'}
            {record?.updated_at
              ? dayjs(record.updated_at).format('DD/MM/YYYY HH:mm')
              : ''}
          </Typography.Text>
        </Form.Item>
      </Form>

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button {...saveButtonProps} type="primary">
          保存
        </Button>
      </Space>
    </Edit>
  )
}
