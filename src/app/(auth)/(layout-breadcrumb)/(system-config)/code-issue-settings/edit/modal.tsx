'use client'

import HashDashIcon from '@components/icons/hash-dash-icon'
import { useForm } from '@refinedev/antd'
import { type useModalReturnType, useTranslate } from '@refinedev/core'
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
  const { formProps, saveButtonProps, formLoading, queryResult } = useForm({
    id,
    resource: 'code-issue-settings',
    action: 'edit',
  })

  const record = queryResult?.data?.data

  return (
    <Edit
      // footerButtons={
      //   <Space>
      //     <Button onClick={close}>{t('buttons.back')}</Button>
      //     <Button {...saveButtonProps} type="primary">
      //       {t('buttons.save_settings')}
      //     </Button>
      //   </Space>
      // }
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
    >
      <Form
        {...formProps}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
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
              {t('code_issue_settings.fields.enum_issue.auto')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.prefix')}
          name="prefix"
          rules={[{ required: true }]}
        >
          <Input placeholder="例: PD" />
        </Form.Item>

        <Form.Item
          label={<HashDashIcon />}
          valuePropName="checked"
          name="hash_dash"
        >
          <Checkbox />
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.segment')}
          name="segment"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'none', label: 'YY' },
              { value: 'year_month', label: 'YYYY/MM' },
              { value: 'year_month_day_range', label: 'YYY/MM/DD' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.serial_length')}
          name="serial_length"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={10} />
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
        <Button onClick={close}>{t('buttons.back')}</Button>
        <Button {...saveButtonProps} type="primary">
          {t('buttons.save_settings')}
        </Button>
      </Space>
    </Edit>
  )
}
