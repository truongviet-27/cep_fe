import HashDashIcon from '@components/icons/hash-dash-icon'
import { useForm } from '@refinedev/antd'
import { type useModalReturnType, useTranslate } from '@refinedev/core'
import { segmentOptions } from '@utility/options'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'

type Props = {
  modalProps: useModalReturnType
  id: string | number
}

export const CodeIssueSettingEdit: React.FC<Props> = ({ modalProps, id }) => {
  const t = useTranslate()
  const { close } = modalProps
  const { formProps, saveButtonProps, formLoading, queryResult, onFinish } =
    useForm({
      id,
      resource: 'code-issue-settings',
      action: 'edit',
    })

  const record = queryResult?.data?.data

  // Sử dụng form instance để theo dõi giá trị issue_method
  const [form] = Form.useForm()
  // Kết hợp form instance với formProps
  const mergedFormProps = { ...formProps, form }

  // Theo dõi giá trị issue_method
  const issueMethod = Form.useWatch('issue_method', form)
  const isManual = issueMethod === 'manual'

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
    >
      <Form
        {...mergedFormProps}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        onFinish={async (values) => {
          const result = await onFinish(values)
          if (result) {
            close()
          }
        }}
      >
        <Form.Item
          label={t('code_issue_settings.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          <Input disabled />
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
          <InputNumber disabled />
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.preview_code')}
          name="preview_code"
        >
          <Input disabled />
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
