'use client'

import { useForm } from '@refinedev/antd'
import { type useModalReturnType, useTranslate } from '@refinedev/core'
import { Button, Checkbox, DatePicker, Form, Input, Space } from 'antd'
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
  const { formProps, saveButtonProps, formLoading } = useForm({
    id,
    resource: 'code-issue-settings',
    action: 'edit',
  })

  return (
    <Edit
      footerButtons={
        <Space>
          <Button onClick={close}>{t('buttons.back')}</Button>
          <Button {...saveButtonProps} type="primary">
            {t('buttons.edit')}
          </Button>
        </Space>
      }
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' } }}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={t('code-issue-settings.fields.code')}
          name={['code']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.name')}
          name={['name']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.issue_method')}
          name={['issue_method']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.prefix')}
          name={['prefix']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.hash_dash')}
          valuePropName="checked"
          name={['hash_dash']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Checkbox>Hash Dash</Checkbox>
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.segment')}
          name={['segment']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.serial_length')}
          name={['serial_length']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.total')}
          name={['total']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.preview_code')}
          name={['preview_code']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.created_by')}
          name={['created_by']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.updated_by')}
          name={['updated_by']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.created_at')}
          name={['created_at']}
          rules={[
            {
              required: true,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label={t('code-issue-settings.fields.updated_at')}
          name={['updated_at']}
          rules={[
            {
              required: true,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Edit>
  )
}
